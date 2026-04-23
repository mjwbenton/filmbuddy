# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Run from the repo root unless noted. npm workspaces are used; the root forwards to each package.

- `npm run dev` — start the Vite dev server for the SPA (`packages/app`) on port 5173.
- `npm run build` — build all workspaces. For `packages/app` this runs `tsc -b && vite build`.
- `npm run typecheck` — typecheck every workspace.
- `npm run lint` / `npm run format` / `npm run format:check` — ESLint and Prettier across the repo.
- `npm run test` — Vitest in every workspace. The app's tests use jsdom + Testing Library.
- Single test file: `cd packages/app && npx vitest run src/path/to/file.test.tsx`.
- Single test name: add `-t "<name substring>"` to the vitest command.
- PWA icons: `cd packages/app && npm run build:pwa-assets` (regenerates `public/` icons from `appicon.png`).
- Infra preview/deploy (rarely needed locally — CI does it): `cd packages/infra && npm run preview` or `npm run up`. Both invoke `build:lambda` first (esbuild bundles `lambda/handler.ts` → `lambda/dist/handler.mjs`).

## Architecture

### Monorepo layout

- `packages/app` — the React 18 + Vite SPA (the PWA users install). Pure client-side; no backend besides the backup Lambda.
- `packages/infra` — Pulumi (TypeScript, CommonJS) program that provisions the site (S3 + CloudFront + Route53 + ACM) and the backup API (S3 + Lambda Function URL + STS federation). State backend is `s3://filmbuddy.mattb.tech-infra-state`.
- `design/` — ignored by ESLint. Contains the Claude Design HTML/CSS handoff bundle; read it when implementing visual changes, but do not import from it.

### App state model (`packages/app/src/state`)

Single `AppStateProvider` React context holds the entire app state in memory and persists it to `localStorage` under key `filmbuddy.state.v2` (see `persistence.ts`). All writes go through pure-function mutators in `mutators.ts`; the provider wraps them to `setState((prev) => fn(prev, ...))`. Selectors in `selectors.ts` derive view data. `types.ts` is the source of truth for the domain shape: `Camera`, `Roll` (including `digital: true` placeholder rolls), `Shot`, plus `Stock`/`Lens`/`Filter` lookup tables that `ensureByName` dedupes case-insensitively.

Key invariants worth preserving:

- A `Camera.currentRollId` points at the one active roll per camera; completing or deleting a roll clears it.
- Loading a new roll auto-completes the previous non-digital active roll (see `loadRoll`).
- `restoreFromSnapshot` keeps the local `backupKey` — the key is user-specific and must not be clobbered by a restore.

### Navigation and sheets

There is no router. `packages/app/src/nav/context.tsx` holds a discriminated-union `screen` (home / camera / past-roll) and a single `sheet` slot. `App.tsx` switches on `screen.name` to render one of `screens/`; `sheets/SheetRoot.tsx` switches on `sheet.kind` to render one of `sheets/`. To add a screen or sheet, extend the union in `nav/context.tsx` and add the matching case in both routers.

### Backup flow

Two-leg flow designed so the SPA never holds long-lived AWS credentials.

1. SPA calls the Lambda Function URL (`VITE_BACKUP_API`, injected at build time in CI) with `{ key, action: 'put' | 'get' }`. `key` is the per-user value in `AppState.backupKey`, format `fb-xxxx-xxxx-xxxx` (enforced by `KEY_PATTERN` in `handler.ts`).
2. Lambda `AssumeRole`s into a federation role with a **session policy** scoped to exactly `s3://<bucket>/<key>/state.json`, and returns the short-lived STS credentials to the browser. The SPA then uses `@aws-sdk/client-s3` directly to PUT or GET the snapshot. See `packages/app/src/backup/client.ts` and `packages/infra/lambda/handler.ts`.
3. Download path validates the snapshot with Zod (`backup/schema.ts`) before returning.

If you change `AppState`'s shape, update `backup/schema.ts` and consider whether `STATE_KEY` needs a version bump.

### Infra wiring

- Two AWS accounts. The deploy account (`625838970384`) holds the app's S3/CloudFront/Route53/Lambda. The parent account (`858777967843`) owns the `mattb.tech` hosted zone and the `github-actions-admin` OIDC role that CI assumes.
- `src/providers.ts` reads `deployRoleArn` / `parentRoleArn` from Pulumi config and creates two providers; resources pass `{ provider: deployProvider }` or `{ provider: parentZoneProvider }` explicitly. ACM certs for CloudFront must be in `us-east-1`.
- `src/site.ts` wires S3 (OAC-only, not public) → CloudFront (with `403→/index.html` for SPA routing) → Route53 alias. `src/delegation.ts` creates the NS delegation record in the parent zone.
- `src/backup.ts` builds the bucket (versioned, SSE, CORS-scoped to the prod domain + `localhost:5173`), the Lambda execution role, and the separate federation role trusted by the execution role. The federation role has bucket-wide `GetObject`/`PutObject`; per-request narrowing happens via session policies in `handler.ts`.

### CI/CD (`.github/workflows/deploy.yml`)

`push` to `main` runs `verify` (format/lint/test + pwa-assets) then `deploy`:

1. `pulumi up` with stack `prod`.
2. Reads `backupApiUrl` from Pulumi outputs and exports it as `VITE_BACKUP_API` for the SPA build.
3. `aws s3 sync` the build to the site bucket, then explicitly re-uploads `index.html` with `Cache-Control: no-cache` (the rest gets `max-age=300`).
4. CloudFront invalidation on `/*`.

The SPA build depends on the infra deploy finishing first because it needs the Lambda URL — don't try to build+deploy the SPA without running Pulumi or without setting `VITE_BACKUP_API`.

### TypeScript conventions

Root `tsconfig.base.json` enables `strict`, `noUncheckedIndexedAccess`, and `exactOptionalPropertyTypes`. The `exactOptionalPropertyTypes` flag is load-bearing in places (see the comment in `backup/client.ts` where a Zod `.optional()` return is cast back to `AppState`). When adding optional properties, write `foo?: T | null`, not `foo?: T | undefined`, and be deliberate about omitting vs. passing `undefined`.

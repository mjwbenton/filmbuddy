# First deploy — bootstrapping FilmBuddy in a fresh AWS account

This doc walks through the one-time setup to stand FilmBuddy up from scratch.
Once it's done, ongoing deploys are just `git push` to `main` and GitHub
Actions takes it from there (`.github/workflows/deploy.yml`).

## What gets created

Pulumi (`packages/infra`) provisions everything the app needs in the deploy
account:

- S3 site bucket `filmbuddy.mattb.tech` (private, served via CloudFront OAC)
- CloudFront distribution + ACM cert (us-east-1) for `filmbuddy.mattb.tech`
- Route53 sub-zone `filmbuddy.mattb.tech` (delegated from the parent zone)
- S3 backup bucket `filmbuddy.mattb.tech-backups` (versioned, SSE-S3, CORS)
- Lambda + Function URL that vends scoped STS creds for the SPA to PUT/GET
  its backup JSON

Delegation (NS record) is written into the parent account's `mattb.tech`
public hosted zone.

## Account layout

FilmBuddy spans two AWS accounts (see `packages/infra/src/providers.ts`):

| Account          | Role                                                                                   |
| ---------------- | -------------------------------------------------------------------------------------- |
| `858777967843`   | Parent. Owns `mattb.tech` hosted zone `Z2GPSB1CDK86DH` and the `github-actions-admin` OIDC role. |
| `625838970384`   | Deploy. All app infra (buckets, CloudFront, Lambda, sub-zone) lives here.              |

The `github-actions-admin` role in the parent account is trusted by both
accounts, so a single OIDC assume-role from GitHub Actions can create
resources in either place.

"Fresh AWS account" in this doc means a new **deploy account**. The parent
account, its hosted zone, and the OIDC role are assumed to exist already.

## Prerequisites

Local:

- Node 24 (pinned in `.node-version`)
- [Pulumi CLI](https://www.pulumi.com/docs/install/)
- AWS CLI v2, logged in with credentials that can assume into both accounts
  (or with two named profiles, one per account)

In AWS:

- Parent account `858777967843`
  - Hosted zone `Z2GPSB1CDK86DH` for `mattb.tech` exists.
  - IAM role `github-actions-admin` exists, trusts GitHub's OIDC provider
    for this repo, and has permission to `sts:AssumeRole` into the deploy
    account (or inline admin rights, matching the role name).
- Deploy account `625838970384`
  - Trusts `github-actions-admin` in the parent account. The simplest
    pattern is a role named the same thing in the deploy account whose
    trust policy allows the parent-account role to assume it; or give the
    parent-account role direct `AdministratorAccess` via a cross-account
    trust.

On GitHub:

- Repo secret `PULUMI_CONFIG_PASSPHRASE` set. Pulumi encrypts stack outputs
  and config secrets with this; any random high-entropy value works, but
  **save it** — losing it orphans the state.

## Bootstrap steps

### 1. Create the Pulumi state bucket (deploy account)

Pulumi uses an S3 backend (`packages/infra/Pulumi.yaml`):

```
s3://filmbuddy.mattb.tech-infra-state
```

Create it in the deploy account, `us-east-1`, with versioning on:

```sh
aws s3api create-bucket \
  --bucket filmbuddy.mattb.tech-infra-state \
  --region us-east-1
aws s3api put-bucket-versioning \
  --bucket filmbuddy.mattb.tech-infra-state \
  --versioning-configuration Status=Enabled
aws s3api put-public-access-block \
  --bucket filmbuddy.mattb.tech-infra-state \
  --public-access-block-configuration \
    BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
```

### 2. Log in to the Pulumi backend

```sh
cd packages/infra
export PULUMI_CONFIG_PASSPHRASE='<same value you put in the GitHub secret>'
pulumi login s3://filmbuddy.mattb.tech-infra-state
```

### 3. Initialize the `prod` stack

```sh
pulumi stack init prod
```

`Pulumi.prod.yaml` already pins `aws:region: us-east-1`.

If your local AWS credentials are not already the right identity in both
accounts (common — e.g. you're running with parent-account creds), tell
Pulumi which role to assume for each provider:

```sh
pulumi config set deployRoleArn  arn:aws:iam::625838970384:role/<role-with-admin-in-deploy>
pulumi config set parentRoleArn  arn:aws:iam::858777967843:role/<role-with-route53-write-in-parent>
```

These are both optional — unset, each provider uses the caller's ambient
credentials. CI runs as `github-actions-admin` (which already has access in
both accounts), so these stay unset in the GHA deploy path.

### 4. First `pulumi up`

From `packages/infra`:

```sh
npm install
npm run up
```

`npm run up` runs the lambda esbuild step first (`scripts/build-lambda.mjs`
writes `lambda/dist/handler.mjs`), then `pulumi up --yes`. The lambda
artifact must exist before Pulumi uploads it.

Expect ~5–10 min — ACM DNS validation and CloudFront distribution creation
are the slow steps.

### 5. Verify DNS delegation

After `pulumi up` finishes, the parent zone should now have an `NS` record
for `filmbuddy.mattb.tech` pointing at the four nameservers of the new
sub-zone. Check:

```sh
dig +short NS filmbuddy.mattb.tech
```

If the NS record is missing, `delegateSubzone()` in `src/delegation.ts`
didn't run successfully — most likely the parent-account provider couldn't
write to `Z2GPSB1CDK86DH`. Fix creds / role, re-run `pulumi up`.

### 6. Confirm the GitHub Actions secret

The deploy workflow reads `PULUMI_CONFIG_PASSPHRASE` from repo secrets.
Without it, `pulumi/actions@v6` will fail to decrypt the stack state.

### 7. First CI deploy

Push to `main`. The `deploy` job in `.github/workflows/deploy.yml`:

1. Assumes `arn:aws:iam::858777967843:role/github-actions-admin` via OIDC.
2. Runs `pulumi up` against the `prod` stack (re-using the state bucket).
3. Reads stack outputs (`siteBucketName`, `cloudfrontDistributionId`,
   `backupApiUrl`).
4. Builds the SPA with `VITE_BACKUP_API` pointing at the Lambda Function URL.
5. Syncs `packages/app/dist` to the site bucket (no-cache on `index.html`).
6. Invalidates CloudFront (`/*`).

Watch the Actions tab; the first run does nothing at the Pulumi layer
since step 4 above already created the resources.

## Post-deploy checks

- `https://filmbuddy.mattb.tech` serves the SPA over HTTPS.
- App loads and the backup nag behaves — the SPA only talks to the Lambda
  URL, so if backup fails in the browser, check CORS on both the Lambda URL
  and the backup bucket (both are set to `https://filmbuddy.mattb.tech`
  and `http://localhost:5173` in `src/backup.ts`).
- `aws s3 ls s3://filmbuddy.mattb.tech-backups/` is empty until the app
  uploads its first backup.

## Handy one-offs

Fetch stack outputs:

```sh
cd packages/infra
pulumi stack output --stack prod
```

Tear everything down (careful — backup bucket is versioned and
`forceDestroy: false`, so you have to empty it by hand first):

```sh
pulumi destroy --stack prod
```

Rebuild the lambda without deploying:

```sh
npm run build:lambda
```

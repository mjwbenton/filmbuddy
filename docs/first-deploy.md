# First deploy — bootstrapping FilmBuddy

This doc walks through the one-time setup to stand FilmBuddy up from scratch.
Once it's done, ongoing deploys are just `git push` to `main` and GitHub
Actions takes it from there (`.github/workflows/deploy.yml`).

## Account layout

FilmBuddy spans two AWS accounts (see `packages/infra/src/providers.ts`):

| Account        | Role                                                                                             |
| -------------- | ------------------------------------------------------------------------------------------------ |
| `858777967843` | Parent. Owns `mattb.tech` hosted zone `Z2GPSB1CDK86DH` and the `github-actions-admin` OIDC role. |
| `625838970384` | Deploy. All app infra (buckets, CloudFront, Lambda, sub-zone) lives here.                        |

## Prerequisites

Repo secret `PULUMI_CONFIG_PASSPHRASE` set in github. Pulumi encrypts stack outputs
and config secrets with this; any random high-entropy value works, but
**save it** — losing it orphans the state.

Changes have been deployed to [mjwbenton/aws-account-stack](https://github.com/mjwbenton/aws-account-stack).

## Bootstrap steps

### 1. Log in to the Pulumi backend

```sh
cd packages/infra
export PULUMI_CONFIG_PASSPHRASE='<same value you put in the GitHub secret>'
AWS_PROFILE=filmbuddy-admin pulumi login s3://filmbuddy.mattb.tech-infra-state
```

### 2. Initialize the `prod` stack

From `packages/infra`:

```sh
AWS_PROFILE=filmbuddy-admin pulumi stack init prod
```

### 3. Push to `main`

Trigger CI by pushing to `main`
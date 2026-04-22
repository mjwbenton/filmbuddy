import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';

const config = new pulumi.Config();

// Deploy account 625838970384 owns the app: S3 site bucket, CloudFront,
// Route53 zone for filmbuddy.mattb.tech, Lambda + backup bucket.
//
// Parent account 858777967843 owns the mattb.tech public hosted zone
// (Z2GPSB1CDK86DH) and holds the GitHub OIDC role
// github-actions-admin that has access to both accounts.
//
// One or both of `deployRoleArn` / `parentRoleArn` must be set via
// `pulumi config set` so the default AWS identity running `pulumi up`
// can STS-AssumeRole into the correct account for each resource set.
// When unset the provider runs with the caller's ambient credentials.

const deployRoleArn = config.get('deployRoleArn');
const parentRoleArn = config.get('parentRoleArn');

export const deployProvider = new aws.Provider('deploy', {
  region: 'us-east-1',
  ...(deployRoleArn
    ? { assumeRoles: [{ roleArn: deployRoleArn, sessionName: 'pulumi-deploy' }] }
    : {}),
});

export const parentZoneProvider = new aws.Provider('parent-zone', {
  region: 'us-east-1',
  ...(parentRoleArn
    ? { assumeRoles: [{ roleArn: parentRoleArn, sessionName: 'pulumi-parent-zone' }] }
    : {}),
});

// ACM certs for CloudFront must live in us-east-1 even if the rest of
// the deploy resources are regional — kept as a separate provider for
// clarity.
export const deployUsEast1Provider = deployProvider;

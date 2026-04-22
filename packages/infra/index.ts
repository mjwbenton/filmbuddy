import { buildSite } from './src/site';
import { delegateSubzone } from './src/delegation';

const site = buildSite();
delegateSubzone(site.zone.nameServers);

export const siteBucketName = site.siteBucket.bucket;
export const cloudfrontDistributionId = site.distribution.id;
export const cloudfrontDomain = site.distribution.domainName;
export const zoneNameServers = site.zone.nameServers;

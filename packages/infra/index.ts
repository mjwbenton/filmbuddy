// FilmBuddy infrastructure entrypoint.
// Subsequent commits will wire up:
//   src/providers.ts  — deploy + parent-zone AWS providers
//   src/site.ts       — S3 + CloudFront + ACM + Route53 (filmbuddy.mattb.tech)
//   src/delegation.ts — NS delegation from mattb.tech parent zone
//   src/backup.ts     — backup bucket + Lambda Function URL (STS vending)
export {};

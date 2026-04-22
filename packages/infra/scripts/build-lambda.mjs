import { build } from 'esbuild';
import { rmSync, mkdirSync } from 'node:fs';

rmSync('lambda/dist', { recursive: true, force: true });
mkdirSync('lambda/dist', { recursive: true });

await build({
  entryPoints: ['lambda/handler.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  outfile: 'lambda/dist/handler.mjs',
  // @aws-sdk/* is provided by the Lambda runtime (Node 18/20/22).
  external: ['@aws-sdk/*'],
  legalComments: 'none',
  minify: false,
});

console.log('built lambda/dist/handler.mjs');

import { defineConfig } from 'tsup';
import { readFileSync } from 'fs';

const getNoExternals = () =>
  Object.entries(JSON.parse(readFileSync('./package.json').toString()).dependencies)
    .map(([k, v]) => k);


export default defineConfig({
  name: 'tsup',
  target: 'node20',
  minify: true,
  bundle: true,  
  noExternal: getNoExternals(),  
  external: [
    '@suchipi/node-mac-permissions',
    'suchibot',
    'esbuild',
  ],
  dts: {
    resolve: true,
    entry: './src/index.ts',
  },
});

import { build } from 'esbuild';
import { cp, mkdir, copyFile, rm, writeFile } from 'node:fs/promises';
await rm('dist', { recursive: true, force: true });
await mkdir('dist/fonts', { recursive: true });
await cp('public', 'dist', { recursive: true });
await copyFile('src/index.html', 'dist/index.html');
await copyFile('src/style.css', 'dist/app.css');
for (const font of ['lora', 'manrope']) {
  for (const subset of ['cyrillic', 'latin']) {
    await copyFile(`node_modules/@fontsource-variable/${font}/files/${font}-${subset}-wght-normal.woff2`, `dist/fonts/${font}-${subset}-wght-normal.woff2`);
  }
}
for (const subset of ['cyrillic', 'latin']) await copyFile(`node_modules/@fontsource-variable/lora/files/lora-${subset}-wght-italic.woff2`, `dist/fonts/lora-${subset}-wght-italic.woff2`);
await mkdir('dist/engine', { recursive: true });
for (const ext of ['js', 'wasm']) await copyFile(`node_modules/stockfish/src/stockfish-17.1-lite-single-03e3232.${ext}`, `dist/engine/stockfish-17.1-lite-single-03e3232.${ext}`);
await copyFile('node_modules/stockfish/Copying.txt', 'dist/engine/Copying.txt');
await build({ entryPoints: ['src/app.js'], bundle: true, minify: true, format: 'esm', outfile: 'dist/app.js', target: ['es2022'], legalComments: 'eof' });
await writeFile('dist/.nojekyll', '');
console.log('Built birthday gift with local fonts, photographs, and Stockfish WASM.');

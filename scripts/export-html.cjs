#!/usr/bin/env node
/** Package the exact same frozen source, styles, fonts and engine into one file. */
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const design = JSON.parse(read('slides/design.json'));
const content = JSON.parse(read('slides/content.source.json')).map(slide => (design[slide.id] ? { ...slide, html: design[slide.id] } : slide));
if (content.length !== 71) throw new Error('The source must contain 71 slides.');
const assets = new Map();
function embed(url) {
  if (!url.startsWith('/') || url.startsWith('//')) throw new Error(`Unexpected asset: ${url}`);
  if (!assets.has(url)) {
    const file = path.join(root, 'public', url);
    const mime = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' }[path.extname(url)];
    if (!mime) throw new Error(`Unsupported asset: ${url}`);
    assets.set(url, `data:${mime};base64,${fs.readFileSync(file).toString('base64')}`);
  }
  return assets.get(url);
}
const fonts = read('app/fonts.css').replace(/url\((\/fonts\/[^)]+)\)/g, (_, url) => `url(${embed(url)})`);
const slides = content.map(({ sourceNodes, ...slide }) => ({
  ...slide,
  html: slide.html.replace(/src="(\/[^\"]+)"/g, (_, url) => `src="${embed(url)}"`),
  ...(slide.expandedHtml ? { expandedHtml: slide.expandedHtml.replace(/src="(\/[^\"]+)"/g, (_, url) => `src="${embed(url)}"`) } : {}),
}));
const runtime = ts.transpileModule(read('components/deck-runtime.ts'), { compilerOptions: {
  target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, strict: true,
} }).outputText;
const json = JSON.stringify(slides).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
const html = `<!doctype html><html lang="mn"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#ffffff"><title>life3.0</title><style>${fonts}\n${read('app/globals.css')}</style></head><body><main class="deck-root" aria-label="Амьдрал 3.0"></main><script id="slide-source" type="application/json">${json}</script><script>(()=>{const exports={};\n${runtime}\nexports.mountDeck(document.querySelector('main'),JSON.parse(document.getElementById('slide-source').textContent));})();</script></body></html>`;
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist/life3.html'), html);
console.log(`dist/life3.html: 71 slides, ${assets.size} embedded assets, ${(Buffer.byteLength(html) / 1024 / 1024).toFixed(2)} MB; no external dependencies.`);

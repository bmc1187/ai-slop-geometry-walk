// Inline the Vite build output into a single, self-contained `dist/index.html`.
//
// Why: `vite build` emits an index.html that references external JS/CSS via
// `<script type="module" src="./assets/...">` and `<link rel="stylesheet">`.
// That is fine over http(s), but opening the file directly (file://, e.g. after
// downloading it or double-clicking it) fails: browsers block cross-origin
// module/stylesheet fetches from `file://`, and a *classic* script placed in
// <head> (a common hand-inlining mistake) runs before <body> — so the engine
// can't find its canvas and throws
// "Cannot find existing element in the DOM".
//
// This script inlines the CSS into a <style> block and the JS into a classic
// <script> placed at the *end of <body>*, so parsing has finished and the
// canvas already exists. The result is one file that runs offline by
// double-click in any browser. Uses only Node built-ins.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const indexPath = join(dist, 'index.html');

if (!existsSync(indexPath)) {
  console.error(`inline-dist: ${indexPath} not found — run "vite build" first`);
  process.exit(1);
}

const asset = (file) => readFileSync(join(dist, file), 'utf8');
const attr = (tag, name) => tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']+)["']`, 'i'))?.[1];

let html = readFileSync(indexPath, 'utf8');
let inlined = 0;

// Inline every stylesheet link.
html = html.replace(/<link\b[^>]*>/gi, (tag) => {
  if (attr(tag, 'rel')?.toLowerCase() !== 'stylesheet') return tag;
  const href = attr(tag, 'href');
  if (!href || /^https?:/i.test(href)) return tag;
  inlined += 1;
  return `<style>\n${asset(href.replace(/^\.?\//, ''))}\n</style>`;
});

// Collect module scripts and drop the tags; we re-insert them at the end of
// <body> as classic scripts (the bundle has no ESM syntax, so this is safe).
const scripts = [];
html = html.replace(/<script\b[^>]*><\/script>/gi, (tag) => {
  if (attr(tag, 'type')?.toLowerCase() !== 'module') return tag;
  const src = attr(tag, 'src');
  if (!src || /^https?:/i.test(src)) return tag;
  scripts.push(asset(src.replace(/^\.?\//, '')));
  inlined += 1;
  return '';
});

if (scripts.length === 0) {
  console.error('inline-dist: no module script found in dist/index.html');
  process.exit(1);
}

const inlineScripts = scripts.map((js) => `<script>\n${js}\n</script>`).join('\n');
if (!html.includes('</body>')) {
  console.error('inline-dist: dist/index.html has no </body>');
  process.exit(1);
}
html = html.replace('</body>', `${inlineScripts}\n  </body>`);

writeFileSync(indexPath, html);
console.log(`inline-dist: inlined ${inlined} asset(s) into dist/index.html (${html.length} bytes)`);

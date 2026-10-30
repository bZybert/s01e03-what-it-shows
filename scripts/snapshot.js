// Copies a built kb page to rendered/ as one static file: the page as the desk sees it, without
// the client scripts (they only hydrate what is already rendered). Run after `npm run build`.
// Usage: node scripts/snapshot.js kb/incidents/4471/problems
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const page = process.argv[2];
const html = readFileSync(join('build', page, 'index.html'), 'utf8')
  .replace(/<link[^>]*rel="modulepreload"[^>]*>\s*/g, '')
  .replace(/<script\b[\s\S]*?<\/script>\s*/g, '');

const out = join('rendered', page, 'index.html');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, html);
console.log(`${out} · ${html.length} chars`);

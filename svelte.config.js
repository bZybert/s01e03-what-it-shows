import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';
import { fileURLToPath } from 'node:url';

// The kb export is `apps/kb/` of the support repo; this is the frame that builds it on its own.
const runbook = fileURLToPath(new URL('./src/lib/layouts/runbook.svelte', import.meta.url)).replaceAll('\\', '/');

/** @type {import('@sveltejs/kit').Config} */
export default {
  extensions: ['.svelte', '.svx'],
  preprocess: [mdsvex({ extensions: ['.svx'], layout: { runbook } })],
  kit: {
    adapter: adapter(),
    // Styles inline, so one built page is the whole page as the desk sees it.
    inlineStyleThreshold: Infinity,
    alias: { '#lib': 'src/lib' },
    prerender: { entries: ['/kb'] },
  },
};

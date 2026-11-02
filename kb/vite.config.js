import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

// Build setup added for this export: the kb's own pages, rendered the way the desk reads them.
export default defineConfig({
  plugins: [
    sveltekit({
      extensions: ['.svelte', '.svx'],
      preprocess: [
        mdsvex({
          extensions: ['.svx'],
          layout: { runbook: fileURLToPath(new URL('./src/lib/layouts/runbook.svelte', import.meta.url)) },
        }),
      ],
      adapter: adapter(),
      inlineStyleThreshold: Infinity,
      prerender: { entries: ['/kb'], handleHttpError: 'warn' },
    }),
  ],
});

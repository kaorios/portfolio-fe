import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    /* The same `@/*` alias `tsconfig.json` gives the application code. */
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});

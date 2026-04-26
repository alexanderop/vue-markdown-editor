import { fileURLToPath } from 'node:url'

import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'

import viteConfig from './vite.config'

// Pure-logic tests: jsdom is fine when nothing depends on real selection,
// Range, IME, or contenteditable. Anything that touches those belongs in
// vitest.config.browser.ts.
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      name: 'web/unit',
      environment: 'jsdom',
      include: [
        'src/**/__tests__/**/*.{test,spec}.{ts,tsx}',
        'src/**/*.{test,spec}.{ts,tsx}',
        'tests/**/*.{test,spec}.{ts,tsx}',
      ],
      exclude: [...configDefaults.exclude, 'e2e/**', 'src/**/*.browser.{test,spec}.{ts,tsx}'],
      root: fileURLToPath(new URL('./', import.meta.url)),
    },
  }),
)

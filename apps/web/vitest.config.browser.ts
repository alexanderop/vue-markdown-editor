import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import viteConfig from './vite.config'

// Browser mode: required for component tests that touch DOM behaviour jsdom
// fakes (selection, Range, IME, contenteditable, IntersectionObserver, etc).
// Convention: `*.browser.test.ts(x)` files run here.
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      name: 'web/browser',
      include: ['src/**/*.browser.{test,spec}.{ts,tsx}'],
      setupFiles: ['./tests/setup-browser.ts'],
      // Pass on an empty scaffold so the verification gate stays green before
      // the first component lands. The a11y meta-test (in the unit project)
      // catches the dangerous case — a real browser test that skips a11y.
      passWithNoTests: true,
      browser: {
        enabled: true,
        provider: playwright(),
        headless: true,
        instances: [{ browser: 'chromium' }],
      },
      root: fileURLToPath(new URL('./', import.meta.url)),
    },
  }),
)

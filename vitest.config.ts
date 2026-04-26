import { defineConfig } from 'vitest/config'

// Root Vitest config — discovers per-workspace projects so `pnpm test` runs
// every workspace from one process. Browser-mode tests live in apps/web and
// are excluded here; run them via `pnpm --filter @vme/web test:browser`.
export default defineConfig({
  test: {
    projects: [
      'apps/web/vitest.config.unit.ts',
      'apps/api/vitest.config.ts',
      'packages/*/vitest.config.ts',
    ],
  },
})

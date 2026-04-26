import { fileURLToPath } from 'node:url'
import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
// @ts-expect-error — flat-config plugins ship loose types we don't need to fight.
import pluginVueA11y from 'eslint-plugin-vuejs-accessibility'
// @ts-expect-error — see above.
import pluginPlaywright from 'eslint-plugin-playwright'
import pluginVitest from '@vitest/eslint-plugin'
// @ts-expect-error — see above.
import pluginRegexp from 'eslint-plugin-regexp'
// @ts-expect-error — e18e ships a single flat config object on `.configs.recommended`.
import pluginE18e from '@e18e/eslint-plugin'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from 'eslint-config-prettier/flat'

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,ts,mts,tsx}'],
  },

  globalIgnores([
    '**/dist/**',
    '**/dist-ssr/**',
    '**/coverage/**',
    '**/node_modules/**',
    '**/.tmp/**',
  ]),

  ...pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  // Vue accessibility lints — only meaningful for SFCs.
  // Plugin ships an array of flat configs; scope each one to apps/web .vue files.
  ...(pluginVueA11y.configs['flat/recommended'] as unknown[]).map((c) => ({
    ...(c as Record<string, unknown>),
    files: ['apps/web/**/*.vue'],
  })),

  // Regex correctness, repo-wide.
  pluginRegexp.configs['flat/recommended'],

  // e18e ecosystem-perf hints. The plugin's config typing is the legacy/flat
  // union, so we cast at the import boundary — runtime shape is a flat config.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (pluginE18e as any).configs.recommended,

  {
    ...pluginPlaywright.configs['flat/recommended'],
    files: ['apps/web/e2e/**/*.{test,spec}.{js,ts,jsx,tsx}'],
  },

  {
    ...pluginVitest.configs.recommended,
    files: ['**/__tests__/**/*', '**/*.{test,spec}.{ts,tsx,js,jsx}'],
  },

  // Resolve `.oxlintrc.json` relative to this config — workspaces run eslint
  // from their own cwd, so a bare path would miss it.
  ...pluginOxlint.buildFromOxlintConfigFile(
    fileURLToPath(new URL('./.oxlintrc.json', import.meta.url)),
  ),

  skipFormatting,
)

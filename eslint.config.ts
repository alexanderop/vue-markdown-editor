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
import pluginUnicorn from 'eslint-plugin-unicorn'
// @ts-expect-error — flat-config plugin, loose types.
import pluginImportX from 'eslint-plugin-import-x'
// @ts-expect-error — subpath export, no types.
import eslintCommentsConfigs from '@eslint-community/eslint-plugin-eslint-comments/configs'
// @ts-expect-error — flat-config plugin, loose types.
import pluginPnpm from 'eslint-plugin-pnpm'
// @ts-expect-error — runtime CJS plugin, no types.
import localRules from 'eslint-plugin-local-rules'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from 'eslint-config-prettier/flat'

// Selectors banned everywhere. Listed once and reused so per-scope blocks can
// extend without losing the universal bans (flat-config replaces array rules).
const UNIVERSAL_RESTRICTED_SYNTAX = [
  {
    selector: 'TSEnumDeclaration',
    message: 'Use a union type or `as const` object instead of an enum.',
  },
  {
    selector: 'IfStatement[alternate]',
    message: 'Avoid else / else-if. Return early instead.',
  },
] as const

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
  pluginE18e.configs.recommended,

  {
    ...pluginPlaywright.configs['flat/recommended'],
    files: ['apps/web/e2e/**/*.{test,spec}.{js,ts,jsx,tsx}'],
  },

  {
    ...pluginVitest.configs.recommended,
    files: ['**/__tests__/**/*', '**/*.{test,spec}.{ts,tsx,js,jsx}'],
  },

  // Repo-wide rules: complexity, banned syntax, custom local rules.
  {
    name: 'app/repo-rules',
    files: ['**/*.{ts,mts,tsx,vue}'],
    plugins: { 'local-rules': localRules },
    rules: {
      complexity: ['warn', { max: 10 }],
      'no-nested-ternary': 'error',
      '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'never' }],
      'no-restricted-syntax': ['error', ...UNIVERSAL_RESTRICTED_SYNTAX],
      'local-rules/composable-must-use-vue': 'error',
      'local-rules/extract-condition-variable': 'warn',
    },
  },

  // Ban native try/catch in apps/web/src so feature code uses tryCatch().
  // tryCatch.ts itself is the escape hatch (per-file override below).
  // Tests under apps/web/tests/ keep raw try/catch (meta-tests need it).
  {
    name: 'app/no-try-catch',
    files: ['apps/web/src/**/*.{ts,vue}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        ...UNIVERSAL_RESTRICTED_SYNTAX,
        {
          selector: 'TryStatement',
          message: 'Use tryCatch() from @/lib/tryCatch instead of raw try/catch.',
        },
      ],
    },
  },
  {
    name: 'app/no-try-catch-override',
    files: ['apps/web/src/lib/tryCatch.ts'],
    rules: { 'no-restricted-syntax': 'off' },
  },

  // Vue SFC rules — apps/web only. Vue 3.5+ APIs (define-props-destructuring,
  // useTemplateRef) are safe; the project ships vue@3.5.32.
  {
    name: 'app/vue-rules',
    files: ['apps/web/**/*.vue'],
    rules: {
      'vue/multi-word-component-names': ['error', { ignores: ['App', 'Layout'] }],
      'vue/component-definition-name-casing': ['error', 'PascalCase'],
      'vue/component-name-in-template-casing': [
        'error',
        'PascalCase',
        { registeredComponentsOnly: false },
      ],
      'vue/match-component-file-name': ['error', { extensions: ['vue'], shouldMatchCase: true }],
      'vue/prop-name-casing': ['error', 'camelCase'],
      'vue/attribute-hyphenation': ['error', 'always'],
      'vue/custom-event-name-casing': ['error', 'kebab-case'],
      'vue/no-unused-properties': [
        'warn',
        { groups: ['props', 'data', 'computed', 'methods', 'setup'] },
      ],
      'vue/no-unused-refs': 'warn',
      'vue/no-unused-emit-declarations': 'warn',
      'vue/define-props-destructuring': 'error',
      'vue/prefer-use-template-ref': 'warn',
      'vue/require-expose': 'warn',
      'vue/require-explicit-slots': 'warn',
      'vue/max-template-depth': ['warn', { maxDepth: 8 }],
      'vue/max-props': ['warn', { maxProps: 6 }],

      // TODO(phase-2 i18n): enable when vue-i18n is installed in apps/web.
      // '@intlify/vue-i18n/no-raw-text': ['error', {
      //   ignoreText: ['—', '•', '✓', '·'],
      //   attributes: { '/.+/': ['title', 'aria-label', 'aria-placeholder', 'placeholder', 'alt'] },
      // }],
    },
  },

  // Unicorn — recommended baseline.
  {
    ...pluginUnicorn.configs.recommended,
    files: ['**/*.{ts,mts,tsx,vue}'],
  },
  {
    name: 'app/unicorn-overrides',
    files: ['**/*.{ts,mts,tsx,vue}'],
    rules: {
      'unicorn/no-null': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-array-callback-reference': 'off',
      'unicorn/no-await-expression-member': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/no-useless-undefined': 'off',
      'unicorn/better-regex': 'warn',
      'unicorn/custom-error-definition': 'error',
      'unicorn/no-unused-properties': 'warn',
      'unicorn/consistent-destructuring': 'warn',
    },
  },

  // import-x — cycles + ordering today; restricted-paths waits for features/.
  {
    ...pluginImportX.flatConfigs.recommended,
    files: ['**/*.{ts,mts,tsx,vue}'],
  },
  {
    name: 'app/import-rules',
    files: ['**/*.{ts,mts,tsx,vue}'],
    rules: {
      'import-x/no-cycle': 'error',
      'import-x/order': ['warn', { 'newlines-between': 'always' }],
      // TS handles module resolution and named-export validity; the lint rules
      // mis-resolve Vite aliases, `.vue` files, and Vue 3's named exports
      // without a custom resolver. Tsc already catches these.
      'import-x/no-unresolved': 'off',
      'import-x/named': 'off',
      'import-x/namespace': 'off',
      'import-x/default': 'off',

      // TODO(phase-2 features): enable once apps/web/src/features/ exists.
      // 'import-x/no-restricted-paths': ['error', { zones: [
      //   { target: './apps/web/src/features/<feature>', from: './apps/web/src/features', except: ['./<feature>'] },
      //   { target: './apps/web/src/features', from: './apps/web/src/views' },
      //   { target: ['./apps/web/src/components', './apps/web/src/composables', './apps/web/src/lib', './apps/web/src/stores'],
      //     from: ['./apps/web/src/features', './apps/web/src/views'] },
      // ]}],
    },
  },

  // Test-file lockdowns: ban direct mount/render imports + Vitest niceties.
  {
    name: 'app/test-rules',
    files: ['**/__tests__/**/*.{ts,tsx}', '**/*.{test,spec}.{ts,tsx}'],
    rules: {
      // Force unit tests through createTestApp (which wires the router).
      // Browser-mode tests legitimately use @testing-library/vue render —
      // they exercise real DOM behaviour and benefit from a11y-first queries.
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@vue/test-utils',
              importNames: ['mount', 'shallowMount'],
              message: 'Use createTestApp from src/__tests__/helpers/createTestApp instead.',
            },
          ],
        },
      ],
      'vitest/prefer-to-be': 'error',
      'vitest/prefer-to-have-length': 'error',
      'vitest/prefer-to-contain': 'error',
      'vitest/prefer-mock-promise-shorthand': 'error',
      'vitest/consistent-test-it': ['error', { fn: 'it' }],
      'vitest/prefer-hooks-on-top': 'error',
      'vitest/prefer-hooks-in-order': 'error',
      'vitest/no-duplicate-hooks': 'error',
      'vitest/require-top-level-describe': 'error',
      'vitest/max-nested-describe': ['error', { max: 2 }],
      'vitest/no-conditional-in-test': 'warn',
    },
  },
  // createTestApp itself imports the otherwise-banned mount.
  {
    name: 'app/test-helper-override',
    files: ['apps/web/src/__tests__/helpers/createTestApp.ts'],
    rules: { 'no-restricted-imports': 'off' },
  },

  // Tests legitimately cast DOM elements (`as HTMLInputElement`) and narrow
  // `Object.keys()` results. Tests aren't perf-critical, so inline regex
  // assertions are clearer than module-scoped consts. Both rules are loosened.
  {
    name: 'app/test-asserts-allowed',
    files: [
      '**/__tests__/**/*.{ts,tsx}',
      '**/*.{test,spec}.{ts,tsx}',
      'apps/web/tests/**/*.ts',
      'apps/web/e2e/**/*.ts',
    ],
    rules: {
      '@typescript-eslint/consistent-type-assertions': 'off',
      'e18e/prefer-static-regex': 'off',
    },
  },

  // eslint-comments discipline.
  eslintCommentsConfigs.recommended,
  {
    name: 'app/eslint-comments',
    files: ['**/*.{ts,mts,tsx,vue}'],
    rules: {
      '@eslint-community/eslint-comments/require-description': ['error', { ignore: [] }],

      // TODO(phase-2 i18n): when @intlify/vue-i18n lands, restrict disabling its rules.
      // '@eslint-community/eslint-comments/no-restricted-disable': ['error', '@intlify/vue-i18n/*'],
    },
  },

  // pnpm catalog enforcement (no-op today; future-proofing).
  ...pluginPnpm.configs.recommended,

  // Resolve `.oxlintrc.json` relative to this config — workspaces run eslint
  // from their own cwd, so a bare path would miss it.
  ...pluginOxlint.buildFromOxlintConfigFile(
    fileURLToPath(new URL('./.oxlintrc.json', import.meta.url)),
  ),

  skipFormatting,
)

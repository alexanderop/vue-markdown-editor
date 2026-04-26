import type { KnipConfig } from 'knip'
import { parse, type SFCScriptBlock, type SFCStyleBlock } from 'vue/compiler-sfc'

function getScriptBlockContent(block: SFCScriptBlock | null): string[] {
  if (!block) return []
  if (block.src) return [`import '${block.src}'`]
  return [block.content]
}

function getStyleBlockContent(block: SFCStyleBlock | null): string[] {
  if (!block) return []
  if (block.src) return [`@import '${block.src}';`]
  return [block.content]
}

function getStyleImports(content: string): string {
  return [...content.matchAll(/(?<=@)import[^;]+/g)].join('\n')
}

const config: KnipConfig = {
  // `vue/compiler-sfc` is used by the SFC compiler below. `vue` itself isn't a
  // root devDep — it lives in workspace packages — so tell knip to skip it.
  ignoreDependencies: ['vue'],
  workspaces: {
    '.': {
      entry: ['eslint-local-rules/index.js'],
      project: ['eslint-local-rules/**/*.js'],
    },
    'apps/web': {
      entry: [
        'tests/**/*.ts',
        'e2e/**/*.{test,spec}.ts',
        'e2e/fixtures.ts',
        'env.d.ts',
        // tryCatch is the eslint-enforced escape hatch for try/catch in src/.
        // Keep it as an entry so knip doesn't flag it before any feature uses it.
        'src/lib/tryCatch.ts',
      ],
      project: ['src/**/*.{ts,tsx,vue}', 'tests/**/*.ts', 'e2e/**/*.ts'],
      // tailwindcss: imported via `@import 'tailwindcss'` in src/styles/main.css,
      //   which knip's vue-only style compiler doesn't see.
      // @vitest/browser: implicit peer required by `browser.enabled` in
      //   vitest.config.browser.ts; loaded by vitest, never imported directly.
      ignoreDependencies: ['tailwindcss', '@vitest/browser'],
    },
    'apps/api': {},
    'packages/*': {},
  },
  compilers: {
    vue: (text: string, filename: string) => {
      const { descriptor } = parse(text, { filename, sourceMap: false })
      return [
        ...getScriptBlockContent(descriptor.script),
        ...getScriptBlockContent(descriptor.scriptSetup),
        ...descriptor.styles.flatMap(getStyleBlockContent).map(getStyleImports),
      ].join('\n')
    },
  },
}

export default config

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
      entry: ['tests/**/*.ts', 'e2e/**/*.{test,spec}.ts', 'e2e/fixtures.ts', 'env.d.ts'],
      project: ['src/**/*.{ts,tsx,vue}', 'tests/**/*.ts', 'e2e/**/*.ts'],
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

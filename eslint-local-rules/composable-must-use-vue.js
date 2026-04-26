'use strict'

const path = require('node:path')

const VUE_REACTIVITY_SOURCES = new Set([
  'vue',
  '@vueuse/core',
  '@vueuse/shared',
  'vue-router',
  'vue-i18n',
  'pinia',
])

const isComposableFilename = (filename) =>
  /^use[A-Z]/.test(path.basename(filename, path.extname(filename)))

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'A composable file (use*.ts) must import a reactivity API from Vue or a related library.',
    },
    schema: [],
    messages: {
      notAComposable:
        'File "{{filename}}" looks like a composable but does not import from Vue. Rename it to a util or add a Vue/VueUse/Pinia import.',
    },
  },
  create(context) {
    const filename = context.filename || (context.getFilename && context.getFilename()) || ''
    if (!filename.endsWith('.ts')) return {}
    if (!isComposableFilename(filename)) return {}

    let hasVueImport = false
    return {
      ImportDeclaration(node) {
        const source = node.source && node.source.value
        if (typeof source !== 'string') return
        if (VUE_REACTIVITY_SOURCES.has(source)) {
          hasVueImport = true
        }
      },
      'Program:exit'(node) {
        if (!hasVueImport) {
          context.report({
            node,
            messageId: 'notAComposable',
            data: { filename: path.basename(filename) },
          })
        }
      },
    }
  },
}

'use strict'

const path = require('node:path')

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'The TypeScript type passed to defineProps<T>() must be named [ComponentName]Props.',
    },
    schema: [],
    messages: {
      mismatch:
        'defineProps generic for component "{{component}}" must be "{{expected}}", got "{{actual}}".',
    },
  },
  create(context) {
    const filename = context.filename || (context.getFilename && context.getFilename()) || ''
    if (!filename.endsWith('.vue')) return {}
    const componentName = path.basename(filename, '.vue')
    const expected = `${componentName}Props`

    return {
      CallExpression(node) {
        if (
          !node.callee ||
          node.callee.type !== 'Identifier' ||
          node.callee.name !== 'defineProps'
        ) {
          return
        }
        const typeArgs = node.typeArguments || node.typeParameters
        if (!typeArgs || !typeArgs.params || typeArgs.params.length === 0) return
        const typeArg = typeArgs.params[0]
        if (typeArg.type !== 'TSTypeReference') return
        const ref = typeArg.typeName
        if (!ref || ref.type !== 'Identifier') return
        if (ref.name !== expected) {
          context.report({
            node: typeArg,
            messageId: 'mismatch',
            data: { component: componentName, expected, actual: ref.name },
          })
        }
      },
    }
  },
}

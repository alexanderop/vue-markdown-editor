'use strict'

const path = require('node:path')

const isComposableFilename = (filename) =>
  /^use[A-Z]/.test(path.basename(filename, path.extname(filename)))

const isObjectish = (node) => {
  if (!node) return false
  if (node.type === 'ObjectExpression') return true
  if (
    node.type === 'TSAsExpression' ||
    node.type === 'TSSatisfiesExpression' ||
    node.type === 'TSTypeAssertion'
  ) {
    return isObjectish(node.expression)
  }
  return false
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'A composable (use*.ts) must return an object literal — never a tuple, array, or primitive.',
    },
    schema: [],
    messages: {
      mustReturnObject:
        'Composable "{{name}}" must return an object literal — `return { foo, bar }` — not a tuple or primitive.',
    },
  },
  create(context) {
    const filename = context.filename || (context.getFilename && context.getFilename()) || ''
    if (!filename.endsWith('.ts')) return {}
    if (!isComposableFilename(filename)) return {}

    const name = path.basename(filename, path.extname(filename))

    const checkFunction = (fn) => {
      if (!fn || !fn.body) return
      if (fn.body.type !== 'BlockStatement') {
        if (!isObjectish(fn.body)) {
          context.report({ node: fn, messageId: 'mustReturnObject', data: { name } })
        }
        return
      }
      for (const stmt of fn.body.body) {
        if (stmt.type === 'ReturnStatement' && stmt.argument && !isObjectish(stmt.argument)) {
          context.report({ node: stmt, messageId: 'mustReturnObject', data: { name } })
        }
      }
    }

    return {
      ExportNamedDeclaration(node) {
        const decl = node.declaration
        if (!decl) return
        if (decl.type === 'VariableDeclaration') {
          for (const d of decl.declarations) {
            if (
              d.id &&
              d.id.type === 'Identifier' &&
              d.id.name === name &&
              d.init &&
              (d.init.type === 'ArrowFunctionExpression' || d.init.type === 'FunctionExpression')
            ) {
              checkFunction(d.init)
            }
          }
        }
        if (decl.type === 'FunctionDeclaration' && decl.id && decl.id.name === name) {
          checkFunction(decl)
        }
      },
    }
  },
}

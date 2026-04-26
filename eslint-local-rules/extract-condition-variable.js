'use strict'

const OPERATOR_THRESHOLD = 2

const countLogicalOperators = (node) => {
  if (!node || node.type !== 'LogicalExpression') return 0
  return 1 + countLogicalOperators(node.left) + countLogicalOperators(node.right)
}

const isEarlyExitGuard = (consequent) => {
  if (!consequent) return false
  if (
    consequent.type === 'ReturnStatement' ||
    consequent.type === 'ThrowStatement' ||
    consequent.type === 'ContinueStatement' ||
    consequent.type === 'BreakStatement'
  ) {
    return true
  }
  if (consequent.type === 'BlockStatement' && consequent.body.length === 1) {
    const stmt = consequent.body[0]
    return (
      stmt.type === 'ReturnStatement' ||
      stmt.type === 'ThrowStatement' ||
      stmt.type === 'ContinueStatement' ||
      stmt.type === 'BreakStatement'
    )
  }
  return false
}

const containsOptionalChaining = (node) => {
  if (!node || typeof node !== 'object') return false
  if (node.type === 'ChainExpression') return true
  for (const key of ['left', 'right', 'argument', 'object', 'callee']) {
    if (node[key] && containsOptionalChaining(node[key])) return true
  }
  return false
}

const isTruthyNarrowingPattern = (test) => {
  if (test.type !== 'LogicalExpression' || test.operator !== '&&') return false
  if (test.left.type !== 'Identifier') return false
  const right = test.right
  if (right.type === 'MemberExpression' && right.object.type === 'Identifier') {
    return right.object.name === test.left.name
  }
  return false
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Extract complex if-conditions into a named const for readability.',
    },
    schema: [],
    messages: {
      extract:
        'Extract this condition into a named const for clarity (e.g. `const canX = ...; if (canX) { ... }`).',
    },
  },
  create(context) {
    return {
      IfStatement(node) {
        if (isEarlyExitGuard(node.consequent)) return
        if (containsOptionalChaining(node.test)) return
        if (isTruthyNarrowingPattern(node.test)) return
        if (countLogicalOperators(node.test) >= OPERATOR_THRESHOLD) {
          context.report({ node: node.test, messageId: 'extract' })
        }
      },
    }
  },
}

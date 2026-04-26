'use strict'

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'A function bound to @event in a Vue template must be prefixed handle* (or on* when forwarding a prop).',
    },
    schema: [],
    messages: {
      prefix:
        'Handler "{{name}}" bound to @{{event}} should start with "handle" (e.g. handle{{Cap}}).',
    },
  },
  create(context) {
    const services = context.parserServices || context.sourceCode?.parserServices
    if (!services || typeof services.defineTemplateBodyVisitor !== 'function') {
      return {}
    }
    return services.defineTemplateBodyVisitor({
      "VAttribute[directive=true][key.name.name='on']"(node) {
        const value = node.value
        if (!value || !value.expression) return
        const expr = value.expression
        if (expr.type !== 'Identifier') return
        const name = expr.name
        if (name.startsWith('handle') || name.startsWith('on')) return
        const event =
          (node.key.argument && (node.key.argument.name || node.key.argument.rawName)) || 'event'
        const Cap = event.charAt(0).toUpperCase() + event.slice(1)
        context.report({ node: expr, messageId: 'prefix', data: { name, event, Cap } })
      },
    })
  },
}

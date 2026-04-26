import axe from 'axe-core'

// Minimal axe-core wrapper for browser-mode component tests.
// Throws (and so fails the test) when axe finds any violation.
//
// `@axe-core/playwright` is wired into the e2e suite separately — this helper
// is what apps/web component tests use, since component tests don't go through
// Playwright's `Page`.
export async function expectNoA11yViolations(
  container: Element = document.body,
  options: axe.RunOptions = {},
): Promise<void> {
  const results = await axe.run(container, {
    resultTypes: ['violations'],
    ...options,
  })

  if (results.violations.length === 0) return

  const summary = results.violations
    .map((v) => `- [${v.impact ?? 'unknown'}] ${v.id}: ${v.help} (${v.helpUrl})`)
    .join('\n')

  throw new Error(`Accessibility violations found:\n${summary}`)
}

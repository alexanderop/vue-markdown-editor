import { test as base, expect } from '@playwright/test'

// Shared e2e fixture: surfaces hydration warnings and CSP violations as test
// failures rather than letting them sneak past silently.
//
// Why fail on these proactively:
//   - Hydration mismatches usually mean SSR/CSR drift that breaks reactivity
//     in subtle ways tests rarely catch otherwise.
//   - `securitypolicyviolation` events fire when the CSP we ship doesn't
//     match what the page actually does — a real bug, not noise.
export const test = base.extend({
  page: async ({ page }, use) => {
    const consoleErrors: string[] = []
    const cspViolations: string[] = []

    page.on('console', (msg) => {
      if (msg.type() !== 'warning' && msg.type() !== 'error') return
      const text = msg.text()
      if (
        text.includes('Hydration completed but contains mismatches') ||
        text.includes('Hydration node mismatch') ||
        text.includes('Hydration text mismatch') ||
        text.includes('Hydration children mismatch') ||
        text.includes('[Vue warn]: Hydration')
      ) {
        consoleErrors.push(text)
      }
    })

    await page.addInitScript(() => {
      window.addEventListener('securitypolicyviolation', (event) => {
        // Stash on window so the assertion below can read it via evaluate().
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const w = window as any
        w.__cspViolations ||= []
        w.__cspViolations.push(`${event.violatedDirective} blocked ${event.blockedURI}`)
      })
    })

    await use(page)

    const cspFromPage = await page
      .evaluate(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const w = window as any
        return (w.__cspViolations as string[] | undefined) ?? []
      })
      .catch(() => [] as string[])
    cspViolations.push(...cspFromPage)

    if (consoleErrors.length > 0) {
      throw new Error(`Hydration warnings detected:\n${consoleErrors.join('\n')}`)
    }
    if (cspViolations.length > 0) {
      throw new Error(`CSP violations detected:\n${cspViolations.join('\n')}`)
    }
  },
})

export { expect }

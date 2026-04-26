// Setup file for component tests running in Vitest browser mode.
// Re-export the a11y helper here so test files can `import { expectNoA11yViolations }`
// without each test having to know where the helper lives.
export { expectNoA11yViolations } from './a11y'

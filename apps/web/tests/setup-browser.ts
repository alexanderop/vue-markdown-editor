// Setup file for component tests running in Vitest browser mode.
//
// Imports the app's `main.css` so Tailwind utilities are present when
// components are rendered in the test page. Without this, screenshots and
// any layout-dependent assertion run against unstyled HTML.
//
// `@testing-library/vue` registers its own `afterEach(cleanup)` at module
// load time — don't re-register it here, that produces double-cleanup
// `removeChild` errors when both hooks fire.
import '../src/styles/main.css'

export { expectNoA11yViolations } from './a11y'

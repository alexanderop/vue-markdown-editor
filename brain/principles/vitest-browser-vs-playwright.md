# Vitest Browser Mode vs Playwright

Pick the right tool by what's under test, not by surface API similarity. The two look alike (both drive a real browser, both expose `page`) but solve different problems and run on different architectures.

**Why:** Treating them as interchangeable produces tests that are slow, brittle, or in the wrong layer — Playwright Component Tests serialize JSX across a Node↔browser channel, Vitest Browser Mode compiles your test as a mini-app and runs it _in_ the browser. Same surface, different universe.

## The split

- **Vitest Browser Mode** — component test = **extended integration test** in a real browser.
- **Playwright (`@playwright/test`)** — page test = **end-to-end test** of the whole app.
- **Playwright (`playwright` lib)** — general-purpose browser automation, not a test framework.
- **Vitest (Node)** — unit and integration tests in Node.js for non-DOM logic.

## Why they differ under the hood

|                         | Vitest Browser Mode                                                                          | Playwright Component Testing                     |
| ----------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Where the test runs     | In the browser (Vite-compiled)                                                               | In Node.js, talks to browser via message channel |
| How components render   | Your app's own `render()` (e.g. `mount` from `@vue/test-utils`, `react-dom`)                 | JSX serialized in Node, reconstructed in browser |
| Browser automation      | Provider-pluggable (Playwright or WebdriverIO behind the same `page` API)                    | Playwright, baked in                             |
| Node built-ins in tests | Not available — use Vitest Commands API to bridge to Node                                    | Available (test runs in Node)                    |
| Best at                 | Components in isolation, real DOM behaviour (focus, selection, layout, IntersectionObserver) | Full user flows across pages, networks, auth     |

## How to apply

1. **Component-level behaviour or visuals** → Vitest Browser Mode. Real DOM, real CSS, fast per-test isolation. This is what `*.browser.test.ts` in `@vme/web` is for ([[codebase/ui-component-tests]]).
2. **A full user flow across pages, routes, network, auth** → Playwright `@playwright/test`. The actionable unit is a _page_, not a component.
3. **Pure logic, parsers, pure functions, anything DOM-free** → Vitest in Node (jsdom only when a thin DOM shim is unavoidable).
4. **Scripting a browser for non-test work** (scraping, agent-browser flows, screenshots) → `playwright` the library. Not a test runner.

## Tests that decide it

- "Could a user reach this state by interacting with the rendered component alone?" → component test (Vitest Browser Mode).
- "Does this require routing, multiple pages, or end-to-end network?" → E2E (Playwright).
- "Does this need Node built-ins (`fs`, `node:*`) inside the test body?" → either Node Vitest, or Vitest Browser Mode + Commands API to call into Node.

## Anti-patterns

- Reaching for Playwright Component Testing in this repo — we already standardized on Vitest Browser Mode and the architecture differences (JSX serialization, two-universe rendering) regress ergonomics.
- Putting component-level assertions inside an E2E Playwright spec — slow feedback, full-app boot for a unit of UI.
- Putting full-flow assertions inside a Vitest Browser Mode test — there's no router, no real network, no auth context; you'll fight the environment.

Source: Artem Zakharchenko, _Vitest Browser Mode vs Playwright_ (Nov 2025).

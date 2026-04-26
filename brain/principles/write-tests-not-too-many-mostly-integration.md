# Write Tests. Not Too Many. Mostly Integration.

Optimise the test suite for **confidence per unit of cost**, not for coverage percentage. Pick the layer that gives the most assurance the user-visible behaviour works, and spend most of your effort there — which, for application code, is integration.

**Why:** Coverage is a proxy. Confidence is the goal. Mandates like "100% line coverage" push tests toward trivial code and implementation details, which slow refactors (every internal rename breaks tests) without catching the bugs that actually ship. The Testing Trophy reframes the trade-off: as you move from static → unit → integration → E2E, each test costs more but covers more of the real failure surface. Integration is the sweet spot — fast enough to run on every save, broad enough to catch the wiring that unit tests by design miss.

## The trophy

From cheapest/narrowest to most expensive/broadest:

1. **Static** — TypeScript, ESLint/oxlint. Free per-keystroke confidence on shapes and obvious mistakes. Always-on baseline.
2. **Unit** — pure functions, parsers, isolated logic. Cheap, fast, but only proves the unit works in isolation.
3. **Integration** — multiple units composed as a user encounters them: a component rendered with its real children, a composable wired to a real store. **Most of your effort goes here.**
4. **E2E** — the assembled app driving real routing/network/auth. High confidence, high cost — reserve for golden flows.

## How to apply

1. **Default new tests to the integration layer.** Render the component with its real collaborators and drive it the way a user would. Reach for unit tests when the logic is genuinely standalone (a parser, a pure transform, a composable with no lifecycle/DI — see [[principles/test-composables-by-category]]).
2. **Pick the runner by the unit under test, not by habit.** Component-level integration → Vitest Browser Mode. Cross-page flows → Playwright. Pure logic → Vitest in Node. ([[principles/vitest-browser-vs-playwright]])
3. **Stop mocking the thing you're trying to cover.** Every mock is a hole in the integration. Mock at the edge — outbound network, payment, email — not between your own modules. No shallow rendering.
4. **Test behaviour, not structure.** Assertions should describe what a user sees or what a caller observes. If a refactor that preserves behaviour breaks the test, the test was coupled to internals.
5. **Wrap E2E surfaces.** When you _do_ go to E2E, hide selectors behind page objects so churn stays local. ([[principles/wrap-ui-with-page-objects]])
6. **Treat coverage as a smell sensor, not a target.** Diminishing returns kick in fast above ~70%. Open-source libraries with a stable public API can earn the last 30%; product code usually shouldn't try.

## Anti-patterns

- **100% coverage mandates.** Drives tests toward trivial getters and toward asserting implementation details just to hit the missing line.
- **Heavy mocking inside the system boundary.** Two mocked units "passing" tells you nothing about whether they actually compose. The bug lives in the seam you replaced.
- **Shallow rendering.** Verifies that `<A/>` _references_ `<B/>`, not that they work together. Same failure mode as mocking, in component clothing.
- **Snapshot tests as the primary assertion.** Snapshots capture structure, not intent. They go stale, get rubber-stamped, and silently lose meaning.
- **Inverting the trophy.** A pile of unit tests with one fragile E2E on top means you have lots of green checks and still no idea whether the app boots.

## When this doesn't apply

- **Reusable libraries with a small surface and many consumers.** A breakage fans out to every caller; the math flips and pursuing 100% (and more unit tests) is worth it.
- **Pure-logic packages** (parsers, codecs, math). Unit tests _are_ integration tests there — there's nothing else to integrate with.

Source: Kent C. Dodds, _Write tests. Not too many. Mostly integration._ (13 July 2019, kentcdodds.com); _The Testing Trophy_ (Feb 2018). Originally a tweet by Guillermo Rauch (10 Dec 2016).

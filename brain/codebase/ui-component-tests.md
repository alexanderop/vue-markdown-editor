# Testing `@vme/ui` Base components

All component tests run in **vitest browser mode** (real Chromium via
`@vitest/browser-playwright`), never jsdom. The repo enforces this via the
`web/browser` project (`vitest.config.browser.ts`) and the `*.browser.test.ts`
filename convention. Anything stylistic or behavioural that depends on real
DOM (focus, selection, contenteditable, IntersectionObserver, real layout)
_must_ live in browser mode.

## Layout

- `apps/web/src/components/ui/__tests__/Base<Name>.browser.test.ts` —
  behavioural tests grouped under one `describe('Base<Name>')`. Each `it`
  starts with "should …" so it reads as a sentence.
- `apps/web/src/components/ui/__tests__/Base<Name>.matrix.browser.test.ts` —
  matrix snapshot of the visual contract via `renderEach`.
- `apps/web/tests/render-each.ts` — `it.each`-based snapshot helper modelled
  on Nuxt UI's pattern.
- `apps/web/tests/setup-browser.ts` imports `main.css` (Tailwind utilities +
  design tokens) so component renders are styled in the test page, and
  re-exports `expectNoA11yViolations`. Every browser test file _must_ call
  `expectNoA11yViolations` at least once — the a11y meta-test
  (`apps/web/tests/a11y-meta.test.ts`, runs in the unit/jsdom project) will
  fail CI otherwise.

## Conventions

- **Use plain `render` from `@testing-library/vue`.** Don't wrap in
  disposable factories. We tried `await using` + `Symbol.asyncDispose` for
  cleanup; it fought with testing-library's auto-`afterEach(cleanup)` AND
  vitest browser's per-test DOM teardown, producing `removeChild` errors.
  Auto-cleanup is the single reliable cleanup path.
- **Don't manually `cleanup()`.** Auto-`afterEach(cleanup)` registered by
  testing-library at module load handles it. A second registration in
  `setup-browser.ts` produces `removeChild` errors.
- **Scope axe to `container`, not `baseElement`** — `baseElement` is
  `document.body`, which in browser mode contains vitest's own runner UI and
  produces false positives (`aria-prohibited-attr`, `region`).
- **Pass non-prop attributes via `attrs:`, not `props:`** — strict prop typing
  rejects e.g. `aria-label`, `onUpdate:modelValue`. `attrs` is forwarded to
  the root by Vue automatically; `attrs: { 'onUpdate:modelValue': fn }` is
  also how you attach event listener spies in tests.
- **Drive matrix tests off the variant config** — components export a
  `*VariantConfig` object alongside the `cva()` function so tests enumerate
  variant keys without re-listing them. Adding a variant → forced snapshot
  review; removing one → broken matrix test.
- **One matrix test per component, not one snapshot per prop permutation.**
  Matrix tests lock down the visual contract; behaviour tests live separately
  with role-based queries.
- **Test naming: `it('should …')`** so each test reads aloud as a sentence.
  `renderEach`'s template is `'should render %s correctly'`.

## Running

- `pnpm --filter @vme/web test:browser` — component tests.
- `pnpm --filter @vme/web test` — unit + a11y meta-test (jsdom, fast).
- `pnpm test` from the root — both projects.

# Wrap UI With Page Objects

When a test drives a real UI, do not let raw selectors and widget mechanics leak into the test body. Wrap each significant UI region behind an application-specific object whose methods read like things a user can do or see. Tests call the object; the object knows about the DOM.

**Why:** Tests that reach into HTML directly are brittle to every UI change — rename a class, restructure a panel, swap a control, and dozens of specs go red for reasons unrelated to behaviour. Encapsulating the widgetry confines that churn to one place. The bonus is readability: a test reads as intent ("type a heading, expect the preview to show it") instead of mechanics ("`page.locator('.cm-content').focus()` then `keyboard.type(...)`"). Same encapsulation argument as any other module boundary, applied to the UI surface.

## How to apply

1. **One object per significant region, not per route.** The editor pane, the preview pane, and the header are three objects, even if they live on the same page. Composite structures that exist only to lay out the UI shouldn't show up in the object hierarchy.
2. **Methods speak the user's language.** `editor.replaceDoc(text)`, `preview.headingText()`, `header.toggleTheme()`. Not `getCmContent()` or `clickByCss('.theme-btn')`. If you imagined swapping the underlying widget (CodeMirror → Monaco), the page object's signature shouldn't change.
3. **Return primitives or other page objects.** Strings, booleans, dates — or, on navigation, the next page object. Don't leak `Locator`, `ElementHandle`, or framework types out of the object.
4. **No assertions inside the object.** Its job is access to state. Tests own the assertion logic. Reuse common assertions through helpers, not by burying `expect(...)` in the wrapper.
5. **Encapsulate async and concurrency.** Polling, reload-then-rehydrate, debounce settling — hide all of it behind a method that returns when the user-visible state is reached. Tests should not see waits.
6. **Layer DSLs (Cucumber, internal) on top of page objects, never instead of them.** The parser translates DSL → page object calls. The page object remains the only thing that touches selectors.

## Anti-patterns

- WebDriver / Playwright APIs in the test body. Quoting Simon Stewart: "If you have WebDriver APIs in your test methods, you're doing it wrong." A test full of `page.locator(...)` is a page object waiting to be extracted.
- One giant object per route. Hides nothing — just relocates the mess. Split by user-visible region.
- Assertions inside the object ("`expectHeadingToBe(x)`"). Mixes access with verification, bloats the object, and makes failures harder to diagnose.
- Returning `Locator` so the test can "just chain one more call." That call is the next method on the object — add it there.
- Building page objects for UI hierarchy that only exists for layout (wrappers, grid containers). Model what the user sees, not what the framework rendered.

## When this doesn't apply

- Component tests in Vitest Browser Mode ([[principles/vitest-browser-vs-playwright]]) — the unit under test _is_ the component; wrapping it in a page object adds a layer with no payoff. Page objects earn their keep at the E2E layer where the UI surface is large and shared across many specs.
- One-off `agent-browser` exploration ([[principles/verify-with-agent-browser]]) — that's manual driving, not a test suite. No need to encapsulate.
- A presentation-model architecture where most logic lives below the UI. Test the model directly; the thin UI shell needs little wrapping.

Source: Martin Fowler, _Page Object_ (10 September 2013, martinfowler.com).

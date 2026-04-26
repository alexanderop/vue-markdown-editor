# Test Composables by Category — Independent vs Dependent

Before writing a composable test, classify the composable. The right test shape is determined by what the composable depends on, not by what it returns.

**Why:** A composable is just a function over Vue's reactivity system — until it touches lifecycle hooks (`onMounted`, `onUnmounted`) or DI (`provide`/`inject`). Once it does, calling it outside a component context silently skips the lifecycle and breaks `inject`. Tests pass against a half-initialised composable and lie about behaviour. Categorising up front prevents that lie.

## The split

- **Independent composable** — uses only Vue's reactivity APIs (`ref`, `computed`, `watch`, `reactive`). No `onMounted`/`onUnmounted`, no `inject`. Test it like a pure function: call it, assert on the returned refs.
- **Dependent composable** — uses lifecycle hooks _or_ `inject`. Cannot run correctly outside `setup()`. Needs a real component context.

## How to apply

1. **Read the composable's imports first.** `onMounted`, `onScopeDispose`, `inject`, `provide`, `getCurrentInstance` → dependent. Otherwise → independent.
2. **Independent → direct invocation.** No helper, no mount. Just `const { value } = useThing(ref(...))` and assert.
3. **Dependent on lifecycle → mount it.** Wrap the call in a minimal Vue app so `onMounted` fires. A `withSetup` helper that does `createApp({ setup() { result = composable(); return () => {} } }).mount(...)` is enough.
4. **Dependent on `inject` → provide it.** Wrap the test component in a parent that calls `provide(key, value)` before mounting. Return an `unmount` so each test cleans up its own app.
5. **Don't reach for the helper by default.** If the composable is independent, mounting an app is dead weight that hides what's actually tested.

## Anti-patterns

- Using `withSetup` for an independent composable — adds a Vue app for no reason and slows the test.
- Calling a dependent composable directly and asserting on the initial ref — `onMounted` never ran; you tested the constructor, not the composable.
- Sharing one mounted app across tests — leaks state between cases. Mount per test, unmount in cleanup.
- Mocking `localStorage`/`inject`/lifecycle to avoid mounting — you've now replaced the integration you were trying to cover. Mount it for real.

Source: Alexander Opalic, _How to Test Vue Composables_ (own writing).

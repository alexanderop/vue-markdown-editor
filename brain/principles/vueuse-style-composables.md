# VueUse-Style Composables

When writing a composable, follow the patterns VueUse uses. They make composables flexible, SSR-safe, leak-free, and type-inferred — and they keep ours consistent with the library we already prefer.

**Why:** [[prefer-vueuse]] tells you to reach for VueUse first. When you do have to write your own (no VueUse equivalent, or a hard requirement conflicts), it should look and behave like a VueUse composable. Anything else is a maintenance trap: untyped inputs, missing cleanup, broken on the server, surprise APIs.

## Structure

- One folder per composable: `useThing/index.ts` + `useThing/index.test.ts`. Named exports only; no defaults.
- Names: `useX` (state/effects), `createX` (factory), `onX` (event listener), `tryX` (silent-fail variant of a Vue API).
- Types: `UseXOptions`, `UseXReturn`. Export both alongside the function.

## Reactivity

- `shallowRef` for primitives and objects you replace whole (`user.value = next`). `ref` only when you mutate nested fields.
- For user-supplied state, expose a `shallow?: boolean` option and let the caller choose.
- Inputs accept `MaybeRefOrGetter<T>`; unwrap with `toValue()`. Never read `.value` on inputs — the caller may pass a getter.
- Expose refs as `readonly()` unless mutation is part of the public API.

## SSR & cleanup

- Guard every browser API behind `isClient` / a `defaultWindow`-style fallback. Composables must not throw at import or in `setup()` on the server.
- Register teardown via `tryOnCleanup` (wraps `onScopeDispose` and no-ops outside a scope). Every listener, timer, and observer pairs with a cleanup in the same function.
- For optional APIs (clipboard, geolocation, etc.) expose an `isSupported` ref via a `useSupported(check)` helper — don't throw, degrade.

## Shape of the return

- Multiple values → object of refs + methods. Single value → return the ref directly. Order-dependent destructure (`[state, toggle]`) → tuple.
- Controllable composables: **Pausable** (`{ isActive, pause, resume }`) for two-way, **Stoppable** (`{ isPending, stop }`) for one-way.
- Async composables: return `{ data, error, isLoading, execute }`. If awaiting matters, implement `then` so `await useThing(...)` resolves once `isLoading` flips false.

## Options & docs

- Every option has a JSDoc block with `@default`. Reactive options take `MaybeRefOrGetter`. Events are callback options (`onSuccess`, `onError`, `onChange`) — don't invent a custom event bus.
- Reusable option fragments live in a shared types module: `ConfigurableWindow`, `ConfigurableDocument`. Extend, don't duplicate.
- Public composables get a JSDoc with `@param`, `@returns`, and an `@example`. The example is the contract — if it doesn't compile, the API is wrong.

## Anti-patterns

- Reading `props.foo` directly inside a composable instead of accepting `MaybeRefOrGetter<Foo>`.
- Setting up listeners without a paired cleanup, or relying on the caller to call `stop()`.
- Using `ref` for primitives "to be safe" — it costs a deep proxy you don't use.
- Throwing on the server because `window` is undefined; or stubbing it globally instead of guarding at the call site.
- Returning raw mutable refs for read-only state — callers will mutate them and you'll inherit the bug.

Pairs with [[prefer-vueuse]] (use theirs first), [[vue-layered-components]] (composables are the logic layer; this is how that layer is shaped), and [[test-composables-by-category]] (independent vs dependent — these patterns keep most composables independent).

Source: Alexander Opalic, _Vue Composables Style Guide: Lessons from VueUse's Codebase_ (own writing, derived from the VueUse source).

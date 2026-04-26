# Prefer Deep Modules

A **module** is anything with an **interface** and an **implementation** — function, composable, component, package. Its **depth** is how much behaviour sits behind the interface. Reach for **deep** (a lot of behaviour, small interface). Avoid **shallow** (interface nearly as complex as the implementation).

**Why:** Every interface a reader has to learn is a tax. A deep module pays that tax back many times over — one interface, lots of behaviour. A shallow module charges the tax for nothing — the caller still has to know what's inside, because the interface didn't actually hide anything. Shallow modules look like decomposition but are really just indirection: more files, more names to learn, no fewer ideas.

## How to spot a shallow module

- The interface restates the implementation: props match internal calls one-for-one.
- It's a pass-through — every method forwards to one method on a single dependency.
- Reading a feature requires bouncing across N modules, none of which stands alone.
- Deleting it doesn't make complexity vanish — it just moves the same code one level up.

## The deletion test

Imagine deleting the module. If complexity vanishes, it was a pass-through and should go. If the same complexity reappears scattered across N callers, the module was earning its keep — keep it, and probably make it deeper still.

## Worked example: EditorPane → useMarkdownEditor

`EditorPane.vue` used to sit between `EditorScratch.vue` and `useMarkdownEditor`. Its only job: take `theme` / `language` / `vim` props and forward them to `setTheme` / `setLanguage` / `setVim` via three near-identical `watch` calls.

- **Interface:** four reactive props + one emit.
- **Implementation:** four reactive props wired to four method calls.
- The interface restated the implementation. **Shallow.**

Deletion test: removing it didn't reappear at N callers (there was one). The watch boilerplate moved _into_ `useMarkdownEditor` — and shrank, because the composable already owned the compartments.

After: `useMarkdownEditor` accepts `theme: MaybeRefOrGetter<Extension>` (etc.) directly, watches them internally, and seeds the initial `EditorState` with the live values. Same behaviour, one fewer file, no `<EditorPane>` to learn. The reactive→imperative seam now lives _inside_ the module that owns the imperative shell — exactly where [[codemirror-imperative-shell]] and [[vueuse-style-composables]] put it.

## When a thin wrapper is fine

Two adapters justify a seam; one adapter is a hypothetical seam. A thin wrapper earns its keep when:

- It pins a project-wide default that several callers reuse (e.g. one wrapper, many call sites).
- It enforces an invariant the underlying API can't (validation, ordering, lifecycle pairing).
- It's the only place a domain term lives.

If none of those apply, inline it.

## Anti-patterns

- A component whose entire job is `props in → method calls out`.
- A composable that wraps a single VueUse call to rename two variables. (See [[prefer-vueuse]].)
- "Adapter" layers added "for testability" when the **interface is the test surface** of the module above already.
- Splitting by file count — comprehension, not line count, is the cut criterion ([[vue-layered-components]]).

Pairs with [[subtract-before-you-add]] (deepening usually subtracts a layer first), [[vueuse-style-composables]] (composables absorb the reactive→imperative boundary so a wrapper component isn't needed), [[boundary-discipline]] (depth concentrates validation/wiring at one seam), and [[migrate-callers-then-delete-legacy-apis]] (the safe move when you collapse a shallow layer into a deeper one).

Source: John Ousterhout, _A Philosophy of Software Design_ — chapters on "Modules Should Be Deep" and "Information Hiding (and Leakage)".

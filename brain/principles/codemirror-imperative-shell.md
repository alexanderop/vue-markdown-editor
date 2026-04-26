# CodeMirror as Imperative Shell

[CodeMirror 6](https://codemirror.net/) is the editor surface — the textarea our users actually type into. It is **not** another reactive Vue thing. CM is a _functional core, imperative shell_: an immutable `EditorState` updated via dispatched transactions, wrapped in a stateful `EditorView` that owns its own DOM. Treat it that way and the integration is small. Treat it like a controlled `<input>` and you will fight it forever.

**Why:** CM6 was specifically designed so the document, selection, undo history, decorations, and configuration are all _values_ in one immutable state. That gives us cheap "old vs new" diffs (great for our preview pipeline), surgical decorations (lint, search, collab cursors), and a battle-tested viewport renderer for huge docs. Wrapping it in a Vue `ref` defeats every one of those properties. We adopt CM's model at the boundary; above it, Vue stays Vue.

## The mental model

```
                   ┌──────────────────────────────────┐
   user input ──▶  │  EditorView   (imperative shell) │  ◀── view.dispatch(tr)
                   │   ↳ owns the DOM, reads layout   │
                   │   ↳ holds .state                 │
                   └──────────────┬───────────────────┘
                                  │  state.update(spec) → Transaction
                                  ▼
                   ┌──────────────────────────────────┐
                   │  EditorState  (functional core)  │   immutable
                   │   doc · selection · fields       │   pure functions
                   │   facets · extensions            │
                   └──────────────────────────────────┘
```

Three rules carry the whole integration:

1. **State is immutable.** Never mutate `view.state.*`. To change anything — doc, selection, options, decorations — call `view.state.update({...})` and dispatch the resulting transaction.
2. **The view owns the DOM.** Don't reach in with `querySelector`. Don't render Vue templates inside `.cm-content`. Affect display via [decorations](https://codemirror.net/examples/decoration/), panels, tooltips, or themes.
3. **Everything is an extension.** Keymaps, themes, language support, gutters, lint, autocomplete, our own behaviors — all just values in one flat `extensions: []` array. Precedence with `Prec.high/low`. Deduplicated by identity, so it's safe to compose.

## Bridging into Vue

The shell is imperative, but the integration has a deterministic shape. Always:

- **Mount in `onMounted`, destroy in `onBeforeUnmount`.** Forgetting `view.destroy()` leaks event handlers, mutation observers, and animation frames.
- **Hold the view in `shallowRef` (or a plain `let`).** Never `ref()` it. CM owns deep state; Vue's deep reactivity will both miss the actual changes and waste cycles trying to track them. The same goes for `EditorState` — don't wrap.
- **Doc → Vue:** install one `EditorView.updateListener` that emits the doc string (debounced 30–60ms for the preview, undebounced for `v-model`-style emits if needed). Skip when `update.docChanged` is false.
- **Vue → Doc:** when the bound value changes from outside (file load, undo from history outside CM, AI rewrite), diff against `view.state.doc.toString()` and dispatch a single replacement transaction. Skipping the diff causes write-loops; skipping the transaction causes split-brain.
- **Reconfigure with Compartments, not by re-creating the view.** One compartment per swappable concern: `themeCompartment`, `languageCompartment`, `readOnlyCompartment`. Switching theme = `view.dispatch({effects: themeCompartment.reconfigure(newTheme)})`. Tearing down and rebuilding the view drops history, scroll, and selection.
- **Check VueUse first.** Per [[prefer-vueuse]], confirm whether `@vueuse/integrations` ships a CM6 wrapper before hand-rolling the mount/destroy/listener boilerplate. If yes, use it; if no, write one composable and reuse it.

## The composable shape

The integration belongs in one composable, exposing intent — not the view object. Per [[vue-layered-components]] this is the **logic layer**; the component above is humble (just the mount point and slots).

```ts
// useMarkdownEditor.ts (sketch)
export function useMarkdownEditor(opts: { initialDoc: Ref<string>; onDoc: (s: string) => void }) {
  const host = ref<HTMLElement>()
  let view: EditorView | undefined
  const themeCompartment = new Compartment()
  const languageCompartment = new Compartment()

  onMounted(() => {
    view = new EditorView({
      parent: host.value!,
      state: EditorState.create({
        doc: opts.initialDoc.value,
        extensions: [
          basicSetup,
          languageCompartment.of(markdown()),
          themeCompartment.of(lightTheme),
          EditorView.updateListener.of((u) => {
            if (u.docChanged) opts.onDoc(u.state.doc.toString())
          }),
        ],
      }),
    })
  })

  onBeforeUnmount(() => view?.destroy())

  return {
    host,
    setDoc(next: string) {
      if (!view || view.state.doc.toString() === next) return
      view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: next } })
    },
    setTheme(theme: Extension) {
      view?.dispatch({ effects: themeCompartment.reconfigure(theme) })
    },
    focus() {
      view?.focus()
    },
  }
}
```

The component above this never sees `EditorView`. The component below this never exists.

## How CodeMirror meets Comark

This editor's loop is: **CM emits doc string → debounce → comark parses → `<ComarkRenderer>` renders preview.** Both halves have the same architectural shape — immutable state, pure parse, dumb render — so they compose cleanly. (See [[comark-rendering-pipeline]].)

- The doc string from `update.state.doc.toString()` is the only thing that crosses the boundary.
- Selection / cursor / scroll never leave CM. The preview doesn't need them; if it ever does (e.g. sync scroll, source-map highlight on hover), pass through CM-side decorations or a separate channel — don't pollute the markdown source string.
- Don't try to round-trip through the AST. CM owns the source; Comark consumes a copy.

## Choosing extensions

Default to packages, not custom code:

- **`codemirror`** umbrella + **`basicSetup`** — line numbers, undo, search, gutters, default keymap. Use this until we have a reason not to.
- **`@codemirror/lang-markdown`** — syntax + indentation + nested code-block highlighting (pass `codeLanguages: languages` from `@codemirror/language-data` for fenced blocks).
- **`@codemirror/commands`** — undo/redo, indent, history, default keymaps.
- **`@codemirror/search`**, **`@codemirror/autocomplete`**, **`@codemirror/lint`** — drop in when needed.

Custom extensions only when no package fits. Pick the right axis:

- **`Facet`** — configuration knobs (multiple inputs combined into one value).
- **`StateField`** — derived state that needs to live across transactions (folded ranges, lint diagnostics, marker positions).
- **`ViewPlugin`** — imperative DOM things tied to the viewport (floating UI, custom cursors, IntersectionObserver-driven loaders). Should be a **shallow view over state** — no business state of its own.
- **`Decoration`** (mark / widget / replace / line) — anything that changes how existing text _looks_ or inserts UI inline.

When in doubt: state lives in a `StateField`; presentation in `Decoration`s derived from it; DOM glue in a `ViewPlugin`. That triad is CM's version of [[vue-layered-components]].

## Pitfalls

- **Treating doc as a string prop with `watch`.** Naïve two-way binding causes write-loops. Always diff before dispatching, and always set the value through `dispatch`, not by re-creating state.
- **Wrapping `view` or `state` in `ref`.** Vue's deep reactivity vs CM's immutable trees = wasted cycles and missed changes. Use `shallowRef` or a plain variable.
- **Recreating the view on theme/language change.** Loses scroll, selection, undo. Use a `Compartment`.
- **Touching `.cm-content` from Vue.** The MutationObserver will fight back. Use decorations.
- **Querying coordinates outside the viewport.** CM only renders visible lines; `coordsAtPos` for an offscreen position returns `null`. Scroll first, then measure in `requestMeasure`.
- **Forgetting `view.destroy()`** in `onBeforeUnmount`. Leaks handlers and breaks SSR/HMR.
- **Mixing extensions per-render.** Building the array inside a render path triggers full reconfiguration on every change. Define extensions as module-level constants; use `Compartment` for the parts that actually swap.
- **Driving initial config with `watch(..., { immediate: true })`.** The watcher fires synchronously during `setup`, _before_ the composable's `onMounted` creates the view — so `setTheme` / `setLanguage` see no view and silently no-op. Apply initial state inside `onMounted` (or at view-construction time via `extensions:`); use the watcher only for subsequent changes.

## What's authoritative

CM moves; this file is design intent, not API truth.

- `https://codemirror.net/` — site and try-it
- `https://codemirror.net/docs/ref/` — reference manual
- `https://codemirror.net/docs/guide/` — system guide (the source for the model above)
- `https://codemirror.net/examples/` — official patterns (decoration, panel, tooltip, autocomplete, collab, mixed-language)
- `https://github.com/codemirror/dev` — umbrella repo / issue tracker
- `https://discuss.codemirror.net/` — forum, where Marijn answers gnarly questions

Pairs with [[boundary-discipline]] (CM's imperative shell sits at one edge; everything above is pure), [[vue-layered-components]] (composable owns the view, component is just a mount point, controller wires both halves), [[comark-rendering-pipeline]] (the doc string is the only thing that crosses), [[prefer-vueuse]] (check before hand-rolling lifecycle glue), and [[vueuse-style-composables]] (the composable above takes the VueUse shape — `MaybeRefOrGetter` inputs, `shallowRef` for the view, `tryOnCleanup`/`onBeforeUnmount` teardown).

# Feature: Brainstorm Editor — MVP

> A frictionless, local-first split-view markdown editor for solo-dev thinking. CodeMirror on the left, Comark preview on the right, Linear aesthetic, no chrome.

## Overview

A single-document, browser-based markdown scratchpad. Open the tab, type, see beautifully rendered markdown next to the source. State persists to `localStorage` silently. No login, no sidebar, no toolbar — just the writing surface. Designed as a personal thinking tool for a solo developer; brainstorming "superpowers" (slash menus, AI margin, structural outlines) are deliberately deferred until MVP is dogfooded.

## Goals

- Zero friction between thought and capture: open → typing in <1s, autosave, no UI noise.
- Beautiful rendered preview that makes the document feel like a real artifact, not draft text.
- Stay aligned with project conventions: Comark pipeline, CM6 imperative shell, Linear design tokens, layered Vue components.
- Ship the smallest editor that's still pleasant to live in — then evolve based on real use.

## Audience

Solo developer using the editor as a personal scratchpad. Single-user, single-device, single-document. No collaboration, no multi-doc, no cloud.

## Architecture

Follows the established brain principles — no deviation.

- **CodeMirror 6 as imperative shell** ([[principles/codemirror-imperative-shell]])
  - One composable `useMarkdownEditor` owns mount/destroy/listeners. Component above is a humble mount point.
  - `view` held in `shallowRef`; never `ref()`.
  - Doc → Vue via one `updateListener` (debounced 30–60ms).
  - Vue → Doc via diff-then-dispatch on the `EditorView`.
  - `Compartment` for the theme; never re-create the view on theme change.
- **Comark three-stage pipeline** ([[principles/comark-rendering-pipeline]])
  - `parse()` + `<ComarkRenderer>` split (not `<Comark>`).
  - One `EditorRenderer` defined via `defineComarkRendererComponent`, imported wherever rendering is needed.
  - `autoClose: true`, debounced parse on the same buffer the listener emits — no per-keystroke parsing.
  - `:streaming="true"` while typing, flip to `false` on idle.
- **Layering** ([[principles/vue-layered-components]])
  - Logic: `useMarkdownEditor`, `usePersistedDoc`, `useComarkPreview` composables.
  - Presentation: `<EditorPane>`, `<PreviewPane>` — props/slots only.
  - Controller: `<EditorView>` (the page) wires composables to panes.

## UI / Visual

- **Layout:** 50/50 vertical split, full viewport. No sidebar, no header, no footer. A single 1px border between panes.
- **Aesthetic:** Linear-inspired, per `brain/codebase/linear-design-tokens.md`.
  - Dark-first surface (`bg #0d0d0d`), text `#e6e6e6`, borders `#1f1f1f`.
  - Inter 14/20 for the preview, JetBrains Mono ~13px for the source pane.
  - Radius 6, no shadows, monochrome accents.
  - Light theme via `Compartment` reconfigure (no view rebuild).
- **Typography in source:** `@codemirror/lang-markdown` highlighting; headings, emphasis, code, lists visually distinct.
- **Typography in preview:** Comark default rendering, Linear tokens applied via global CSS scoped to `.preview` root.
- **Code blocks in preview:** `@comark/vue/plugins/highlight` with shiki, dark-only theme to match the surface.

## Behavior

- **Autosave:** debounced 300ms write of doc string to `localStorage` under one fixed key (`vme:scratch`). On mount, hydrate from that key; if absent, start with an empty doc (or a small welcome stub — TBD during build).
- **Keyboard-only formatting:** rely on CM's default keymap from `basicSetup` + `@codemirror/commands`. No floating toolbar, no slash menu in MVP.
- **No file management:** one document only. Renaming, deleting, switching docs all out of scope.
- **Preview update cadence:** parse on the debounced doc emission (≈40ms). Preview re-renders only when the parsed `ComarkTree` changes by reference (memoize on source).
- **Theme toggle:** single keyboard shortcut (e.g. `Cmd+Shift+L`) flips light/dark. Stored alongside doc in `localStorage`.

## Implementation Details

- **Dependencies (already-aligned):** `codemirror`, `@codemirror/lang-markdown`, `@codemirror/language-data`, `@codemirror/commands`, `comark`, `@comark/vue`, `@comark/vue/plugins/highlight`, `shiki`. Confirm `@vueuse/integrations` does not already wrap CM6 before hand-rolling — per [[principles/prefer-vueuse]].
- **No SSR concerns:** MVP is client-only. `view.destroy()` lives in `onBeforeUnmount` regardless.
- **Persistence layer:** trivial `usePersistedDoc(key)` composable returning `{ doc, setDoc }`. localStorage write is debounced; read is sync at mount.
- **Testing seam:** the `ComarkTree` is the contract — fixtures over the tree, not screenshots. CM logic tested via the composable's public surface (`setDoc`, `focus`), not by reaching into the view.

## Scope

### MVP (this spec)

- Split view, one document.
- CM6 source pane with markdown syntax highlighting.
- Comark preview pane with code-block highlighting.
- localStorage autosave.
- Light/dark theme toggle.
- Keyboard-only interaction (no toolbar, no slash menu).
- Linear design tokens applied to both panes.

### Explicitly out of scope

- Sidebar / multi-doc / file list.
- Cloud sync, accounts, sharing.
- Slash menu, command palette.
- Custom comark blocks (`::decision`, `::question`, `::callout`).
- AI margin / co-thinker.
- Live outline / mind-map view.
- Sync scroll between panes.
- Mobile layout (assume desktop browser).
- Export buttons (Cmd+A → copy is fine for MVP).

### Future Enhancements (deferred — do not pre-plan)

- [ ] Slash-menu with thinking blocks (`/decision`, `/question`, `/todo`, `/callout`)
- [ ] Custom Comark components rendering those blocks richly
- [ ] AI co-thinker margin pane
- [ ] Floating structural outline / mini mind-map
- [ ] Multi-doc with sidebar (IndexedDB)
- [ ] Sync scroll
- [ ] Aggregation views ("show me all decisions")

Direction will emerge from dogfooding the MVP — do not build ahead.

## Status

**Status:** Spec Complete
**Created:** 2026-04-26
**Priority:** TBD

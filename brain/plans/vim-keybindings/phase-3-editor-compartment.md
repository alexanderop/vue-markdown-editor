Back to [[plans/vim-keybindings/overview]]

# Phase 3 — `vimCompartment` in `useMarkdownEditor`

## Goal

Teach the editor composable to swap vim on/off without rebuilding the view. Mirrors the existing `themeCompartment` / `setTheme` pair exactly.

## Changes

- `apps/web/src/composables/useMarkdownEditor.ts`
  - Add `const vimCompartment = new Compartment()` next to the existing compartments.
  - Add `vimCompartment.of([])` to the `extensions` array (initially empty so vim is off by default).
  - Add `setVim(extension: Extension)` to the return type and implementation, dispatching `vimCompartment.reconfigure(extension)`.
- `apps/web/src/composables/__tests__/useMarkdownEditor.browser.test.ts`
  - Add a test in the same shape as the existing theme test (lines ~111–124): mount, type some content, call `setVim(vim())`, assert the editor DOM element identity is unchanged and the document content is unchanged.

## Data structures

- Extend `UseMarkdownEditorReturn`:
  - `setVim: (extension: Extension) => void` — accepts either `vim({ status: true })` or `[]`.

## Verification

### Static

- `pnpm typecheck` clean.
- `pnpm lint` clean.
- The composable still has no Vue-component imports and no DOM queries (per [[principles/vue-layered-components]] — composable stays in the logic layer).

### Runtime

- Browser test passes:
  - Same `EditorView` element after `setVim(vim())` (compartment swap, not view rebuild).
  - Document content preserved across the swap.
  - Document content preserved across the swap-back to `[]`.
- Manual sanity in `agent-browser`: temporarily wire `setVim(vim({ status: true }))` from a console call, confirm the status bar appears and `i` enters insert mode. Revert.

Pairs with [[principles/codemirror-imperative-shell]] — the composable owns the imperative shell and exposes intent (`setVim`), never the `EditorView` itself.

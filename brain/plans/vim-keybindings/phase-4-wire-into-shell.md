Back to [[plans/vim-keybindings/overview]]

# Phase 4 — Wire `useVim` Through `EditorPane` + `EditorScratch`

## Goal

Connect the persisted preference to the editor's vim compartment. After this phase the keyboard shortcut actually toggles vim mode in the live editor, with the status bar.

## Changes

- `apps/web/src/components/editor/EditorPane.vue`
  - Add `vim?: Extension` to `EditorPaneProps`.
  - On mount, if `vim` is set, call `editor.setVim(vim)`.
  - `watch(() => vim, (next) => { if (next !== undefined) editor.setVim(next) })` — same shape as the existing theme/language watchers.
- `apps/web/src/pages/EditorScratch.vue`
  - Import `useVim` and `vim as vimExt` from `@replit/codemirror-vim`.
  - `const { enabled: vimEnabled } = useVim()`.
  - `const vimExtension = computed(() => vimEnabled.value ? vimExt({ status: true }) : [])`.
  - Pass `:vim="vimExtension"` to `<EditorPane>`.
- `apps/web/src/lib/cmThemes.ts` (or the relevant theme file) — add CSS rules ensuring `.cm-panels`, `.cm-panel.cm-vim-panel`, and the vim status text use `var(--background)`, `var(--foreground)`, `var(--border)` so the panel reads correctly in both themes. Inspect the `@replit/codemirror-vim` panel DOM (`.cm-vim-panel`) to confirm selector names before writing rules.

## Data structures

- New prop on `EditorPane`: `vim?: Extension` (matches the existing `theme?` / `language?` pattern).
- `vimExtension` in `EditorScratch` is a `ComputedRef<Extension>`.

## Verification

### Static

- `pnpm typecheck` clean.
- `pnpm lint` clean.
- `EditorScratch` remains a thin controller: pulls composables, computes one extension, passes props. No conditionals, no business logic (per [[principles/vue-layered-components]]).

### Runtime

- Manual via `agent-browser` (this is the first phase where the feature is end-to-end usable):
  1. Open the editor, type a paragraph.
  2. Press `Cmd+Shift+V`. Expect: status bar appears at the bottom of the editor pane showing `-- INSERT --` (or normal — confirm initial mode).
  3. Press `Esc`, then `dd`. Expect: a line is deleted.
  4. Press `Cmd+Shift+V` again. Expect: status bar disappears, doc is preserved, cursor is preserved, vanilla CM behavior returns (typing inserts text).
  5. Reload the page. Expect: vim state persists across reload.
  6. Toggle the theme (`Cmd+Shift+L`) while vim is on. Expect: status bar adopts the new theme's colors.
- Capture a screenshot of vim-on dark and vim-off dark for the report (per [[principles/verify-with-agent-browser]]).

Pairs with [[principles/wrap-ui-with-page-objects]] — the e2e in phase 5 will encapsulate "toggle vim" as a page-object method, not a raw key press in the test body.

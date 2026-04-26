Back to [[plans/vim-keybindings/overview]]

# Phase 5 — E2E Test

## Goal

Lock in the toggle + a representative vim motion as a regression-protected behavior, in the shape the existing editor e2e uses.

## Changes

- `apps/web/e2e/editor.spec.ts` — add a new `test('vim mode toggles via keyboard and exposes status bar', ...)` block.
- `apps/web/e2e/fixtures.ts` or a sibling helper — extend the page-object surface (per [[principles/wrap-ui-with-page-objects]]) so the test reads as intent, not key codes:
  - `editor.toggleVim()` — presses `ControlOrMeta+Shift+KeyV`.
  - `editor.vimMode()` — returns the current mode string from the `.cm-vim-panel` element, or `null` if vim is off.
  - `editor.normalCommand(seq: string)` — types a vim normal-mode sequence (e.g. `'dd'`).

  If `editor.spec.ts` currently uses inline helpers (`replaceDoc`, `clearScratch`) without a page-object module, the minimum addition is one new file `apps/web/e2e/pages/EditorPage.ts` exporting these methods and refactoring the new test to use it. Existing tests can stay on the inline helpers — don't migrate them as part of this phase ([[principles/subtract-before-you-add]] applies to scope, not retroactive cleanup).

## Data structures

- `EditorPage` page object with the methods above. No assertions inside ([[principles/wrap-ui-with-page-objects]]).

## Verification

### Static

- `pnpm typecheck` clean (e2e config).
- `pnpm lint` clean.

### Runtime

The e2e test must:

1. Load the editor with a known multi-line doc seeded via `localStorage` (use the existing `clearScratch` + reload pattern, then set `vme:scratch` directly).
2. Assert `editor.vimMode()` is `null` (vim off).
3. Call `editor.toggleVim()`.
4. Assert `editor.vimMode()` resolves to a string containing `NORMAL` (status bar visible, mode reported).
5. Press `Esc` (defensive — should already be normal), then call `editor.normalCommand('dd')`.
6. Assert the doc shrunk by one line (read via `.cm-content` text content; deduce by line count delta).
7. Call `editor.toggleVim()` again.
8. Assert `editor.vimMode()` is `null` again and the doc is unchanged from step 6.
9. Reload the page; assert vim is **off** at startup (the toggle in step 7 persisted off; this also catches the read-on-mount path).

Run across all three browsers in `playwright.config.ts` (chromium, firefox, webkit). If `webkit` flakes on the keyboard combo, document the workaround in the test rather than disabling.

Pairs with [[principles/contract-tests-over-e2e]] — this e2e covers the user-visible contract (toggle works, motion works, persists). Mode-by-mode vim coverage belongs in `@replit/codemirror-vim`'s test suite, not ours.

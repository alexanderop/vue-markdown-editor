---
status: planned
created: 2026-04-26
spec: docs/feature-specs/vim-keybindings.md
---

# Plan: Vim Keybindings

Optional vim keybindings for the CodeMirror 6 editor pane. Off by default; toggled via `Cmd/Ctrl+Shift+V` and persisted in `localStorage`. Status bar (mode + ex line) renders when on. Editor pane only.

## Context

The user has vim muscle memory from Obsidian / VSCode and wants the scratchpad to feel the same. The CM6 editor is already wired through a `themeCompartment` that swaps live without rebuilding the view; vim is the natural sibling pattern — one more `Compartment` reconfigured between `vim()` and `[]`. Per [[principles/codemirror-imperative-shell]], compartments are how we toggle behavior without losing doc, scroll, undo, or selection.

The original spec proposed a header toggle button next to the theme toggle, but the current shell has no header at all — `EditorScratch.vue` is a 2-pane grid filling the viewport, and theme is keyboard-only. The plan therefore mirrors the theme pattern (keyboard shortcut + persisted preference, no UI chrome). Visual feedback comes from the vim status bar itself, which appears when vim is on.

## Scope

### In

- `@replit/codemirror-vim@^6.3.0` added to the workspace catalog and `apps/web` deps.
- `useVim()` composable: persisted boolean (`vme:vim`), keyboard toggle, returns `{ enabled, toggle }`.
- `vimCompartment` in `useMarkdownEditor`; new `setVim(extension: Extension)` method.
- `vim?: Extension` prop on `<EditorPane>`, watched and applied via `setVim`.
- `<EditorScratch>` computes `vimExtension` from `useVim().enabled` and forwards.
- Vim status bar enabled (`vim({ status: true })`), themed via existing CSS variables.
- Browser test for compartment swap (preserves doc/scroll across toggle).
- Independent unit test for `useVim`.
- E2E test exercising the toggle + a vim motion.

### Out

- Custom vim mappings (`<leader>b/i`, `gqq` reflow, etc.) — future enhancement.
- User-configurable keymaps / settings UI — future enhancement.
- Window-level vim navigation (pane switching, focus preview) — future enhancement.
- Onboarding hint / first-time tooltip — future enhancement.
- Wiring `:w` to a visible save toast — future enhancement.

## Constraints

- **Use `@replit/codemirror-vim`** — it's the maintained CM6 vim port. v6.3.0 (latest at time of plan); peer deps (`view`, `state`, `commands`, `language`, `search`) are already satisfied (`search` ships in `basicSetup`).
- **Compartment, never view rebuild** — per [[principles/codemirror-imperative-shell]]. Toggling mid-edit must preserve doc, selection, scroll, and undo history.
- **Storage key `vme:vim`** — colon namespace matches the existing content key (`vme:scratch`). Theme uses `vme-theme` (legacy hyphen); don't propagate that inconsistency.
- **Composable shape** — follow [[principles/vueuse-style-composables]]: named exports, `UseVimReturn` type, `tryOnCleanup`-free since `useStorage`/`useMagicKeys` self-clean. Mirror `useTheme.ts` for consistency.
- **No header chrome added** — out of scope. Keep the visual surface unchanged when vim is off.

### Alternatives considered

1. **Add a header bar with theme + vim toggle buttons.** Rejected: bigger scope, drags in a UI redesign that isn't requested. Discoverability is moot for a single-user scratchpad.
2. **Floating corner toggle inside the editor pane.** Rejected: introduces chrome on top of CM6's content area, which fights the imperative shell. Would need a `ViewPlugin` or absolute-positioned overlay — disproportionate for one toggle.
3. **Always-on vim.** Rejected: the user explicitly wants a toggle — sometimes vim, sometimes not.
4. **Keyboard shortcut only, persisted (chosen).** Cheapest, matches `useTheme`, status bar provides visual feedback when on.

## Applicable skills

- None beyond the principles. Standard composable + extension wiring.

## Phases

1. [[plans/vim-keybindings/phase-1-add-package]] — workspace catalog + apps/web deps
2. [[plans/vim-keybindings/phase-2-use-vim-composable]] — `useVim` + tests
3. [[plans/vim-keybindings/phase-3-editor-compartment]] — `vimCompartment` + `setVim` in `useMarkdownEditor`
4. [[plans/vim-keybindings/phase-4-wire-into-shell]] — `EditorPane` prop + `EditorScratch` controller
5. [[plans/vim-keybindings/phase-5-e2e-test]] — Playwright spec for the full path

## Verification

Project-level checks the plan must satisfy at the end:

- `pnpm typecheck` clean across the workspace.
- `pnpm lint` clean.
- `pnpm test` (unit + browser) green.
- `pnpm test:e2e` green (chromium/firefox/webkit).
- Manual `agent-browser` walk per [[principles/verify-with-agent-browser]]: open the dev server, press the toggle shortcut, type `dd` in normal mode, confirm a line is deleted; press the shortcut again, confirm vanilla CM behavior returns and the doc state is preserved.

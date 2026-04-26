---
status: spec-complete
created: 2026-04-26
priority: TBD
---

# Feature: Vim Keybindings

> Modal editing in the markdown scratchpad — for users with vim muscle memory who want their editor to feel like home.

## Overview

Add optional vim keybindings to the CodeMirror 6 editor pane via `@replit/codemirror-vim`. Off by default; toggled from a header control next to the theme toggle. Preference persists in localStorage. Full vim status bar (mode indicator + ex command line) renders when enabled. Editor pane only — preview and other surfaces stay normal.

## Goals

- Personal muscle memory: editor feels like vim for users who live in vim.
- Power-user editing speed: modal editing for faster long-form markdown manipulation.
- Parity with Obsidian / VSCode vim modes the user already relies on.

## Activation & Persistence

- **Default:** off. New users get a normal CodeMirror experience.
- **Toggle:** small `Vim` pill/icon in the header, sibling to the existing theme toggle. One click flips modes live (no reload).
- **Persistence:** `useStorage('vme:vim', false)` from VueUse — same shape as the existing `vme:scratch` doc autosave.
- **No keyboard shortcut for the toggle** in MVP (would conflict with vim's own bindings).

## Visualization / UI

- **Header toggle:** matches the visual weight of the theme toggle. Active state shows the editor is currently in vim mode.
- **Status bar:** the full panel from `@replit/codemirror-vim` mounts inside the editor pane when vim is on. Shows `-- NORMAL --` / `-- INSERT --` / `-- VISUAL --` and accepts `:` ex commands.
- **Status bar disappears** when vim is toggled off; no leftover chrome.

## Implementation Details

- **Package:** `@replit/codemirror-vim` (the maintained CM6 vim port).
- **Wiring:** new `vimCompartment` in `useMarkdownEditor`, alongside the existing `themeCompartment`. Reconfigure between `vim()` and `[]` — never tear down the view (preserves doc, scroll, undo, selection). Per [[principles/codemirror-imperative-shell]].
- **Composable shape:** extend `useMarkdownEditor` to accept `vimEnabled: MaybeRefOrGetter<boolean>` and watch it; or expose a `setVim(enabled: boolean)` intent method. Prefer the watch shape — matches how theme is wired today.
- **State source:** a new `useVimMode()` composable wrapping `useStorage('vme:vim', false)` so the controller page and header toggle share one source of truth.
- **Ex commands:** vanilla — `:w` is a no-op (autosave already persists every keystroke), `:q` does nothing meaningful. No custom mappings.
- **Edge cases:**
  - Toggling mid-edit: state preserved via Compartment reconfigure; cursor stays where it is.
  - SSR / hydration: vim extension is client-only; the CM mount already happens in `onMounted`, so no extra guard needed.
  - Theme + vim combined: status bar must read the current theme tokens — ensure the vim panel inherits via CSS variables, not hardcoded colors.

## Scope

### MVP

- [ ] Install `@replit/codemirror-vim`.
- [ ] `useVimMode()` composable backed by `useStorage('vme:vim', false)`.
- [ ] `useMarkdownEditor` accepts a vim-enabled ref and reconfigures `vimCompartment`.
- [ ] Header toggle component (mirrors theme toggle styling).
- [ ] Vim status bar renders when enabled, themed correctly in light + dark.
- [ ] E2E: toggle on, verify mode badge updates on `i` / `Esc`, verify `dd` deletes a line.

### Future Enhancements

- [ ] Markdown-aware custom maps (`<leader>b/i` for bold/italic wrap, `gqq` for paragraph reflow).
- [ ] User-configurable keymaps (settings UI).
- [ ] Window-level vim navigation (`<leader>p` to focus preview, pane switching).
- [ ] Visible save toast wired to `:w` if autosave ever becomes manual.
- [ ] Onboarding hint on first toggle (status bar / Esc explainer).

## Status

**Status:** Spec Complete
**Created:** 2026-04-26
**Priority:** TBD

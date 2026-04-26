Back to [[plans/vim-keybindings/overview]]

# Phase 2 — `useVim` Composable

## Goal

A single source of truth for vim mode: a persisted boolean ref plus a keyboard shortcut that flips it. Mirrors the shape of `useTheme.ts` so future readers see one pattern.

## Changes

- `apps/web/src/composables/useVim.ts` — new file.
- `apps/web/src/composables/__tests__/useVim.test.ts` — new file (independent composable per [[principles/test-composables-by-category]] — uses only `useStorage` + `useMagicKeys`, no lifecycle hooks).

## Data structures

- `UseVimReturn = { enabled: Ref<boolean>; toggle: () => void }`
- Storage key: `'vme:vim'`, default `false`.
- Shortcut: `Cmd+Shift+V` / `Ctrl+Shift+V` — handled identically to `useTheme`'s `Cmd+Shift+L` (use `useMagicKeys` with `passive: false` and `event.preventDefault()` for the combo to avoid browser swallowing it).

## Verification

### Static

- `pnpm typecheck` clean.
- `pnpm lint` clean.
- Composable follows [[principles/vueuse-style-composables]]: named export, return object typed, no default export.

### Runtime

- Unit test (independent, no `withSetup`):
  - Default value is `false`.
  - `toggle()` flips and persists to `localStorage` under `vme:vim`.
  - Re-instantiating the composable picks up the persisted value.
- Manual: in `agent-browser`, press `Cmd+Shift+V`, reload, confirm `localStorage.getItem('vme:vim') === 'true'`. (No editor wiring yet — only the storage flip is observable at this stage.)

Pairs with [[principles/prefer-vueuse]] — `useStorage` and `useMagicKeys` are doing the work; the composable is a thin wrapper.

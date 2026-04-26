Back to [[plans/vim-keybindings/overview]]

# Phase 1 — Add `@replit/codemirror-vim`

## Goal

Make the vim package importable from `apps/web` via the workspace catalog, so subsequent phases can `import { vim } from '@replit/codemirror-vim'`.

## Changes

- `pnpm-workspace.yaml` — add `@replit/codemirror-vim: ^6.3.0` under the `catalog` block, alphabetically near the other `@codemirror/*` entries.
- `apps/web/package.json` — add `"@replit/codemirror-vim": "catalog:"` to `dependencies`.

## Data structures

None.

## Verification

### Static

- `pnpm install` succeeds without peer-dep warnings (peers are all already present: `@codemirror/{view,state,commands,language,search}` — `search` ships in `basicSetup`).
- A throwaway `import { vim } from '@replit/codemirror-vim'` in `useMarkdownEditor.ts` typechecks (`pnpm typecheck`). Remove the import after confirming.

### Runtime

- `pnpm dev` boots the editor without runtime errors and the existing editor still works (no behavior change yet).

Pairs with [[principles/prove-it-works]] — "it installed" is not enough; the throwaway import proves the module resolves and types load.

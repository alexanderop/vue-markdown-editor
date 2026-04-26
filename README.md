# vue-markdown-editor

A proof-of-concept markdown editor built with Vue 3.

> **Status: POC.** Exploring how AI assistance, CommonMark, TanStack, and CodeMirror fit together in a Vue editor. Not production-ready.

## Stack

- **Vue 3 + Vite** — app shell
- **CodeMirror** — editor surface (syntax highlighting, keymaps, extensions)
- **CommonMark** — markdown parsing / rendering (spec-compliant)
- **TanStack** — data layer (queries, caching, sync)
- **AI** — inline assistance (completion, rewriting, suggestions)

## Monorepo layout

```
apps/
  web/            Vue app (editor UI)
  api/            Backend / AI proxy
packages/
  editor-tools/   CodeMirror extensions, markdown helpers
  shared/         Cross-package types and utilities
```

Managed with pnpm workspaces.

## Setup

```sh
pnpm install
pnpm dev
```

## Scripts

```sh
pnpm dev           # start the web app
pnpm build         # build all workspaces
pnpm typecheck     # type-check all workspaces
pnpm lint          # oxlint + eslint
pnpm test          # vitest (unit)
pnpm test:browser  # vitest browser mode
pnpm test:e2e      # playwright
```

## Recommended IDE

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar).

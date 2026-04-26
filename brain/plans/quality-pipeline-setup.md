---
status: executed
created: 2026-04-26
executed: 2026-04-26
---

# Plan: Quality Pipeline Setup

> Establish the rails (monorepo structure + layers 1–6 of the quality pipeline) **before** writing any product code, so every contribution — human or agent — has a fast, layered way to verify itself.

## Overview

Transition the current single-app Vue scaffold into a pnpm monorepo and wire layers 1–6 of the modern frontend quality pipeline (type safety, lint/format, unit, component+a11y, hooks, CI). Defer everything that requires actual product code (MSW, visual regression, Lighthouse, OTel, SBOM) until features exist that need them.

## Locked decisions

| Decision            | Choice                                 | Why                                                    |
| ------------------- | -------------------------------------- | ------------------------------------------------------ |
| Repo layout         | `apps/web` + `apps/api` + `packages/*` | Final shape now, single pipeline config later          |
| Editor surface      | CodeMirror 6 source view               | Deterministic selection model for AI patches           |
| AI tool target      | Comark AST transforms                  | Semantic ops, not error-prone offsets                  |
| Apply UX            | Diff with accept/reject                | User stays in control of AI edits                      |
| Schema lib          | Zod                                    | TanStack AI default, used at every tool + API boundary |
| Gate aggressiveness | Full first cut (layers 1–6)            | Rails before features                                  |
| CI                  | GitHub Actions                         | Best ecosystem fit for the layers we're adding         |
| Task runner         | Raw pnpm `-r` / `--filter`             | Add Turborepo later if cold runs get slow              |

## What we install and configure now

### 0. Repo restructure

```
vue-markdown-editor/
├── pnpm-workspace.yaml
├── lefthook.yml
├── .github/workflows/ci.yml
├── apps/
│   ├── web/           # Vue 3 + comark + CodeMirror 6 (move existing scaffold here)
│   └── api/           # Node + TanStack AI + Code Mode (empty scaffold)
├── packages/
│   ├── shared/        # Zod schemas + shared TS types
│   └── editor-tools/  # toolDefinition() factories (empty stubs for now)
└── brain/
```

Move the existing `src/`, `e2e/`, `vite.config.ts`, `vitest.config.ts`, `playwright.config.ts`, `eslint.config.ts`, `tsconfig.*` files into `apps/web/`. Hoist devDeps that are shared (`oxlint`, `oxfmt`, `eslint`, `typescript`) to the workspace root.

### 1. Supply chain defaults (pnpm)

`pnpm-workspace.yaml`:

```yaml
packages:
  - apps/*
  - packages/*

minimumReleaseAge: 1440 # refuse versions newer than 24h
blockExoticSubdeps: true # block git/tarball-pinned transitive deps
onlyBuiltDependencies: # explicit allowlist for postinstall scripts
  - esbuild
  - vue-demi # add others on a case-by-case basis
```

Free, instant — closes the dominant supply-chain attack vectors.

### 2. Type safety (layer 1)

- TypeScript **strict** in every workspace (`strict: true`, `noUncheckedIndexedAccess: true`).
- `vue-tsc --build` in `apps/web`.
- `tsc --noEmit` in `apps/api` and `packages/*`.
- `zod` added to `packages/shared` as the shared schema lib.
- Convention: every API request/response body and every `toolDefinition()` input/output is a Zod schema, and types are inferred — never written by hand.

### 3. Lint + format (layer 2)

- **oxlint** as the fast first pass.
- **eslint** (flat config) for what oxlint doesn't yet cover.
- New plugins to add:
  - `eslint-plugin-vuejs-accessibility` (a11y in `apps/web`)
  - `eslint-plugin-regexp` (regex correctness, repo-wide)
  - `@e18e/eslint-plugin` (small perf wins)
- **oxfmt** for formatting.
- Wired at root: `pnpm -r lint`, `pnpm -r format`.

### 4. Unit tests (layer 3)

- Vitest in both `apps/web` (jsdom env for pure logic) and `apps/api` (node env).
- Single Vitest workspace config at the root so `pnpm test` runs everything.

### 5. Component tests (layer 4) — **browser mode**

- `@vitest/browser` with **Playwright provider, Chromium** in `apps/web`.
- `@testing-library/vue` for queries.
- **Mandatory** for an editor: jsdom lies about selection, `Range`, IME, `contenteditable`, `IntersectionObserver`. Wire it before the first component lands so we never write a jsdom-only test.

### 6. Accessibility assertions (layer 8 — folded into first cut)

- `@axe-core/playwright` exposed inside Vitest browser mode.
- Helper: `expectNoA11yViolations(container)` available in test setup.
- Meta-test that fails CI if any component test file in `apps/web` lacks at least one a11y assertion (so the practice doesn't slide).

### 7. Playwright fixtures (layer 7 — fixture-level only for now)

- Keep existing Playwright config; move under `apps/web/e2e/`.
- Add shared fixture: listen to `console` and fail on hydration warnings.
- Add shared fixture: listen to `securitypolicyviolation` and fail on any.
- E2E job runs against the built preview (`pnpm --filter web build && pnpm --filter web preview`), not the dev server.
- No actual journey tests yet — just the fixture infra so the first one we write inherits both checks.

### 8. Local hooks — Lefthook

`lefthook.yml`:

```yaml
pre-commit:
  parallel: true
  commands:
    lint:
      glob: '*.{ts,tsx,vue,js}'
      run: pnpm exec oxlint {staged_files}
    format:
      glob: '*.{ts,tsx,vue,js,json,md}'
      run: pnpm exec oxfmt --check {staged_files}
    typecheck:
      glob: '*.{ts,tsx,vue}'
      run: pnpm -r --parallel typecheck
```

`lefthook install` is run once; future contributors get the hooks for free.

### 9. CI — GitHub Actions

`.github/workflows/ci.yml` jobs (all on PR + push to main):

- `install` — pnpm with `--frozen-lockfile`, cache the pnpm store.
- `typecheck` — `pnpm -r typecheck`.
- `lint` — `pnpm -r lint`.
- `unit` — `pnpm -r test:unit`.
- `component` — `pnpm --filter web test:browser` (with Playwright browsers cached).
- `build` — `pnpm -r build`.
- `e2e` — depends on `build`, runs Playwright against the preview.

All jobs run in parallel where dependencies allow. Any red job blocks merge.

## What we explicitly defer

| Layer                                            | When to add                                                                             |
| ------------------------------------------------ | --------------------------------------------------------------------------------------- |
| MSW (layer 5)                                    | When `apps/web` makes its first network call (i.e. when AI features wire to `apps/api`) |
| Contract testing (layer 6)                       | Skip indefinitely — we own both ends                                                    |
| Visual regression (layer 9)                      | When the design system stabilises and there's a preview pane to snapshot                |
| Lighthouse CI + size-limit (layer 10)            | When preview deploys exist and the bundle is non-trivial                                |
| Knip (layer 11)                                  | When the codebase has weight (~5+ files per package)                                    |
| Renovate, OSV-Scanner, Gitleaks, SBOM (layer 11) | First commit worth tracking; OSV/Gitleaks before going public                           |
| i18n drift (layer 12)                            | If/when a second locale ships                                                           |
| Preview deploys (layer 13)                       | When there's something deployable                                                       |
| AI code review (layer 14)                        | Claude Code is already doing review locally                                             |
| OpenTelemetry (layer 15)                         | Skip — overkill for a client-side editor                                                |

## Order of execution

1. Restructure to monorepo (move files, set up workspaces, hoist deps).
2. `pnpm-workspace.yaml` with supply-chain settings.
3. Re-run `pnpm install` against the new layout.
4. Strict TS in every workspace; add Zod to `packages/shared`.
5. Hoist + extend lint/format config; add new plugins.
6. Vitest workspace config + browser mode in `apps/web`.
7. axe helper + meta-test guard for component tests.
8. Lefthook + `lefthook install`.
9. GitHub Actions workflow.
10. Verify: `pnpm install && pnpm -r typecheck && pnpm -r lint && pnpm test && pnpm --filter web test:browser` all green on the empty scaffold.

## Verification gate

The pipeline is "established" when, on a fresh clone:

```sh
pnpm install
pnpm -r typecheck
pnpm -r lint
pnpm test
pnpm --filter web test:browser
pnpm --filter web build
```

…all pass on an empty scaffold, and the same set runs green in CI on a PR.

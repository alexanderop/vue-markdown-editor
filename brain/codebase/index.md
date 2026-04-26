# Codebase

Project-specific knowledge and tooling gotchas for this monorepo.

- [[eslint-flat-config-shapes]] — eslint plugins ship `configs['flat/recommended']` as either an array or an object; spreading the wrong one corrupts the config
- [[vitest-jsdom-import-meta]] — `fileURLToPath(import.meta.url)` throws in vitest's jsdom env; use `// @vitest-environment node` for fs-touching tests
- [[oxlint-monorepo-config-path]] — `eslint-plugin-oxlint`'s `buildFromOxlintConfigFile` resolves relative to cwd; anchor to the config file via `import.meta.url` in pnpm workspaces
- [[tailwind-v4-monorepo-source]] — Tailwind v4 only scans the project containing the CSS entry; cross-package components in `@vme/ui` need an explicit `@source` directive
- [[ui-package-layout]] — `@vme/ui` is the local shadcn-style component library (`Base*` prefix); pattern + dependencies summary
- [[ui-component-tests]] — testing `@vme/ui`: browser mode only, scope axe to `container`, drop manual `cleanup()`, matrix snapshots via `renderEach`

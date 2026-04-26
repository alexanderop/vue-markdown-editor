# Codebase

Project-specific knowledge and tooling gotchas for this monorepo.

- [[eslint-flat-config-shapes]] — eslint plugins ship `configs['flat/recommended']` as either an array or an object; spreading the wrong one corrupts the config
- [[vitest-jsdom-import-meta]] — `fileURLToPath(import.meta.url)` throws in vitest's jsdom env; use `// @vitest-environment node` for fs-touching tests
- [[oxlint-monorepo-config-path]] — `eslint-plugin-oxlint`'s `buildFromOxlintConfigFile` resolves relative to cwd; anchor to the config file via `import.meta.url` in pnpm workspaces

# Codebase

Project-specific knowledge and tooling gotchas for this monorepo.

- [[eslint-flat-config-shapes]] — eslint plugins ship `configs['flat/recommended']` as either an array or an object; spreading the wrong one corrupts the config
- [[vitest-jsdom-import-meta]] — `fileURLToPath(import.meta.url)` throws in vitest's jsdom env; use `// @vitest-environment node` for fs-touching tests
- [[oxlint-monorepo-config-path]] — `eslint-plugin-oxlint`'s `buildFromOxlintConfigFile` resolves relative to cwd; anchor to the config file via `import.meta.url` in pnpm workspaces
- [[tailwind-v4-monorepo-source]] — Tailwind v4 only scans the project containing the CSS entry; cross-package components in `@vme/ui` need an explicit `@source` directive
- [[ui-package-layout]] — `@vme/ui` is the local shadcn-style component library (`Base*` prefix); pattern + dependencies summary
- [[ui-component-tests]] — testing `@vme/ui`: browser mode only, scope axe to `container`, drop manual `cleanup()`, matrix snapshots via `renderEach`
- [[style-guide]] — Vue + TS style guide adapted from typescript-style-guide.com; lists what's lint-enforced vs convention-only
- [[oxlint-vue-config-type-aware-trap]] — `consistent-type-imports` (and `prefer-optional-chain`) flip type-aware parsing on globally via `@vue/eslint-config-typescript`; breaks any file outside a tsconfig include
- [[linear-design-tokens]] — concrete visual tokens (fonts, colors, spacing, radius, shadows, motion) distilled from Linear/Orbiter; pairs with the philosophy in `principles/linear-design-style`

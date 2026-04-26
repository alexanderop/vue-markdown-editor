# `consistent-type-imports` flips on type-aware parsing for the whole repo

Adding `typescript/consistent-type-imports` to `.oxlintrc.json` (or to the eslint config directly) breaks `eslint` on every TS file that isn't in a tsconfig `include` — test helpers, `vitest.config.ts`, etc. The error looks like:

```
Parsing error: <file>.ts was not found by the project service.
Consider either including it in the tsconfig.json or including it in allowDefaultProject
```

## Why

`@vue/eslint-config-typescript` keeps a hard-coded list of rules that "require parser services":

```ts
// node_modules/@vue/eslint-config-typescript/dist/index.mjs
const additionalRulesRequiringParserServices = [
  '@typescript-eslint/consistent-type-imports',
  '@typescript-eslint/prefer-optional-chain',
]
```

When `defineConfigWithVueTs` partitions rules, **any entry** for one of these rules — even `'off'` — moves the file under type-aware parsing.

`eslint-plugin-oxlint` mirrors oxlint rules into eslint as `off` to prevent double-reporting. So enabling `typescript/consistent-type-imports` in oxlint causes the eslint plugin to emit `'@typescript-eslint/consistent-type-imports': 'off'`, which `defineConfigWithVueTs` then promotes to type-aware. Project service then fails on any file outside the tsconfig include set.

## Fix options

1. **(chosen)** Don't enable `consistent-type-imports` anywhere — keep it convention-only. Listed in [[style-guide]] under convention-only.
2. Include every config/test file in a tsconfig — fragile, has to be repeated per-package, project references compound the issue.
3. Add `allowDefaultProject` to parser options — extra surface area; same fragility.

## Generalisation

Any rule in `additionalRulesRequiringParserServices` (today: `consistent-type-imports`, `prefer-optional-chain`) flips this switch globally. Before adding a TS-style rule to oxlint, check that list.

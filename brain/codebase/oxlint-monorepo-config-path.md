# `eslint-plugin-oxlint` config path in monorepos

`pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json')` resolves the path relative to **process cwd**, not to the eslint config file.

**Symptom:** Lint passes from the repo root but fails per-workspace with:

```
eslint-plugin-oxlint: could not find oxlint config file: .oxlintrc.json
```

This happens with `pnpm -r lint`, where each workspace runs `eslint .` from its own directory and the relative path no longer resolves.

**Fix:** Anchor the path to the eslint config file's location.

```ts
import { fileURLToPath } from 'node:url'

...pluginOxlint.buildFromOxlintConfigFile(
  fileURLToPath(new URL('./.oxlintrc.json', import.meta.url)),
),
```

**Generalisation:** Any eslint plugin that takes a file path argument almost certainly resolves it from cwd. In a monorepo with a shared root config, always anchor file-path arguments via `import.meta.url`.

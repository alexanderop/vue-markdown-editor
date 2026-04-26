# pnpm `strictDepBuilds` allowlist

`pnpm-workspace.yaml` sets `strictDepBuilds: true`. Any dep with a postinstall/install script that isn't in `onlyBuiltDependencies` makes `pnpm install` (especially `--frozen-lockfile` in CI) **fail** with `ERR_PNPM_IGNORED_BUILDS`. The intent is _force a decision_ — never let an unknown native module silently skip its build.

## Current allowlist

Verified 2026-04-26:

| Package         | Why                                                           |
| --------------- | ------------------------------------------------------------- |
| `esbuild`       | native binary, used by Vite                                   |
| `lefthook`      | postinstall registers Git hooks                               |
| `unrs-resolver` | native module pulled transitively by `eslint-plugin-import-x` |
| `vue-demi`      | postinstall picks the Vue 2/3 entry                           |

## Symptoms when a new dep needs an entry

```
 ERR_PNPM_IGNORED_BUILDS  Some dependencies require running build scripts:
   - <pkg>
 Run pnpm approve-builds <pkg>, or add it to onlyBuiltDependencies.
```

`pnpm install --frozen-lockfile` errors out instead of skipping. Affects fresh local clones too, not just CI.

## When you add a new dep

1. Run `pnpm install` once with `strictDepBuilds: false` or watch the warning.
2. If a postinstall script is required and the publisher is trusted, append the package to `onlyBuiltDependencies`.
3. Re-run `pnpm install` to confirm green.

Pairs with [[../plans/quality-pipeline-setup]] (where the strict supply-chain stance is set).

# ESLint flat-config plugin shapes

Plugins are inconsistent about whether `configs['flat/recommended']` is an **object** or an **array of objects**. Spreading the wrong shape produces a hard-to-diagnose error.

**Symptoms:** ESLint fails with `ConfigError: Config (unnamed): Unexpected key "0" found.` This means an array was spread into an object literal, producing `{ 0: ..., 1: ..., length: N }`, which `@eslint/config-array` rejects.

**Known shapes (verified 2026-04-26):**

| Plugin                                 | `configs['flat/recommended']` |
| -------------------------------------- | ----------------------------- |
| `eslint-plugin-vue` (flat/essential)   | array                         |
| `eslint-plugin-vuejs-accessibility`    | array (length 2)              |
| `eslint-plugin-regexp`                 | object                        |
| `eslint-plugin-playwright`             | object                        |
| `@e18e/eslint-plugin` (`.recommended`) | object                        |

**Pattern:** Probe at runtime before spreading.

```ts
// Object → spread into a wrapper to add `files`:
{
  ...pluginRegexp.configs['flat/recommended'],
  files: ['**/*.ts'],
}

// Array → map each entry to scope `files`, then spread the array:
...pluginVueA11y.configs['flat/recommended'].map((c) => ({
  ...c,
  files: ['apps/web/**/*.vue'],
}))
```

**One-liner probe:**

```sh
node -e "import('./node_modules/<plugin>/<entry>.js').then(m=>console.log(Array.isArray(m.default.configs['flat/recommended'])?'array':'object'))"
```

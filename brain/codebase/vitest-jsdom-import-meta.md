# Vitest jsdom + `import.meta.url`

`fileURLToPath(import.meta.url)` throws `TypeError: The URL must be of scheme file` when the test runs in vitest's `jsdom` environment.

**Why:** Vite serves the test module to jsdom via an `http://` URL, so `import.meta.url` is not a `file://` URL. Node's `fileURLToPath` rejects it.

**Pattern:** Tests that need real Node fs/path operations should opt into the node env per-file:

```ts
// @vitest-environment node
import { fileURLToPath } from 'node:url'
const ROOT = fileURLToPath(new URL('../', import.meta.url))
```

**When to apply:** Meta-tests that walk the source tree, fixture loaders that read disk, anything calling `fileURLToPath`, `path.dirname(import.meta.dirname)`, or `import.meta.dirname` directly.

**Alternatives:**

- Move the test to a `node`-environment vitest project (`apps/api`, `packages/*`) instead of `apps/web`.
- Use `process.cwd()` + relative paths if the test always runs from a known directory.

The directive is the cheapest fix and lives at the call site, so future readers see why.

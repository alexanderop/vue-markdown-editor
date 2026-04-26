# Comark Rendering Pipeline

Use [Comark](https://comark.dev) (`comark` + `@comark/vue`) as the markdown engine. Treat it as a **three-stage pipeline** — `source → parse() → ComarkTree → render`. Keep the stages separate; never collapse them into a single mystery component call.

**Why:** Comark is the only parser we evaluated that gives us all four properties at once: streaming-safe (`autoClose`), Vue-native rendering, a compact JSON-serializable AST, and `::component{prop="x"}` syntax that lets users embed our own Vue components in their markdown. That spread is the reason it's in this editor — losing any of those properties would make the editor measurably worse, so we design _for them_, not around them.

## The pipeline

```
source ──parse(opts)──▶ ComarkTree { nodes, frontmatter, meta } ──render──▶ Vue VNodes
```

Three stages, one rule each:

- **Parse** is pure and cacheable. Same `(source, options, plugins)` → same `ComarkTree`. Memoize on `source` for the live preview; debounce input, not parses-of-already-parsed-input.
- **The tree is the contract.** Anything that wants to inspect, transform, persist, ship over the wire, or test fixtures sits at this seam. Plugins live here too (TOC, summary, security/sanitize).
- **Render is dumb.** Given a tree + component map, it walks. No business logic, no fetching. If you reach for "transform during render," you wanted a plugin.

This is the same shape as [[vue-layered-components]] — parse is logic, render is presentation, the tree is the boundary. Don't smear them.

## Default to two seams

Pick the seam by who owns the source.

- **`<Comark>`** — high-level, parses _and_ renders. **Async — must be wrapped in `<Suspense>`.** Use only when the source is local and ephemeral (one-shot demos, sandboxes).
- **`parse()` + `<ComarkRenderer>`** — the editor's actual pipeline. Parse in a composable (memoize, debounce, run in a worker if it ever bites), pass the tree to `<ComarkRenderer>`. Synchronous, no `<Suspense>` gymnastics, trivially testable, and the parsed tree is the unit you'd persist or send over the wire.

Default to the split for anything in the editor proper. `<Comark>` is a prototyping convenience, not the production shape.

## Centralize configuration with `defineComarkRendererComponent`

Never scatter `:plugins="[...]"` and `:components="{...}"` arrays through templates. Define one configured renderer per surface and import it.

```ts
// shared/comark.ts
import { defineComarkRendererComponent, defineComarkComponent } from '@comark/vue'
import math, { Math } from '@comark/vue/plugins/math'
import mermaid, { Mermaid } from '@comark/vue/plugins/mermaid'
import highlight from '@comark/vue/plugins/highlight'

export const EditorRenderer = defineComarkRendererComponent({
  name: 'EditorRenderer',
  components: { Math, Mermaid /* + our own ::callout, ::embed, etc. */ },
})

// If you ever need the parsing variant (sandbox, isolated preview):
export const EditorComark = defineComarkComponent({
  name: 'EditorComark',
  plugins: [
    highlight({
      themes: {
        /* … */
      },
    }),
    math(),
    mermaid(),
  ],
  components: { Math, Mermaid },
})
```

Use `extends` to layer surfaces (base + article + comment), don't copy-paste plugin arrays. A new component map should be a code change in one file, not a grep across templates.

## Streaming + the live preview

The editor input _is_ a stream. Treat it like one.

- `autoClose: true` is the default in `parse()` — keep it. It closes incomplete `**bold` / `::alert` so every keystroke yields a valid AST. Don't call `autoCloseMarkdown()` separately; that's double work.
- Debounce parse (≈30–60ms) on input; **don't** parse per character.
- While typing, set `:streaming="true"` on the renderer. Flip to `false` on blur / idle. This tells Comark to render leaf-of-tree placeholders gracefully.
- For AI-stream rendering (assistant output, autocomplete drafts), the same pattern applies plus `caret` for the trailing cursor.

## Authoring our own components

When we add `::callout`, `::embed`, etc., the contract is fixed:

- Comark passes attributes as **props**. `{type="warning"}` → `type: "warning"` (string). Use `:` prefix for typed values: `{:count="5"}` → number, `{:active="true"}` → boolean, `{:cfg='{"k":1}'}` → object.
- Default slot for body, named slots via `#name` markdown blocks → Vue `<slot name="name" />`.
- **Resolution order** when Comark looks up a tag: `Prose{Pascal}` → `{Pascal}` → `{tag}` → globally registered → native HTML. Pick the form intentionally; don't accidentally shadow `h1` with a global.
- A component overriding an HTML tag (e.g. our heading with anchor links) receives `__node?: ComarkElement` — type it with `import type { ComarkElement } from 'comark'`.

These components are still ours and follow [[vue-layered-components]] — Humble Component, no fetching, no business state, just template + props + slots.

## Pitfalls

- **Wrong plugin path with a Vue renderer.** Use `@comark/vue/plugins/*` (framework wrapper bundles plugin fn _and_ Vue component). `comark/plugins/*` is the bare parser plugin — fine for `parse()` standalone, _missing the component_ for math/mermaid.
- **Forgetting `<Suspense>` around `<Comark>`.** It's async. The error is loud but easy to misread; reach for `<ComarkRenderer>` instead and parse upstream.
- **Calling `autoCloseMarkdown` then `parse({autoClose:true})`.** Pick one. Default-on is fine.
- **Per-character parse loop.** O(n²) trap. Always parse on the accumulated buffer, debounced.
- **Peer deps.** `katex` for math, `shiki` for highlight, `beautiful-mermaid` for mermaid. Optional — install only what we ship.

## What's authoritative

This file captures the _design intent_ for our integration. Comark itself moves; treat upstream as truth for API specifics:

- `https://comark.dev` — docs site (rendering, plugins, syntax, AST)
- `https://github.com/comarkdown/comark` — source (`packages/comark`, `packages/comark-vue`, `AGENTS.md`)
- `npx skills add https://comark.dev` — Comark's own agent skill, install when working on integration

Pairs with [[boundary-discipline]] (parse / tree / render are layers — don't cross), [[subtract-before-you-add]] (centralize one renderer before sprinkling plugin arrays), and [[prove-it-works]] (the AST is the seam where we test — fixtures of `ComarkTree`, not screenshots of HTML).

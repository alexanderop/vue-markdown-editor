# Prefer VueUse Over Hand-Rolled Composables

Reach for `@vueuse/core` before writing a composable yourself. If VueUse already solves it, use VueUse.

**Why:** Hand-rolled composables for things VueUse covers (event listeners, storage, debounce/throttle, intersection observers, media queries, clipboard, mouse/keyboard, async state, etc.) duplicate work, miss cleanup, and grow into maintenance burden. VueUse is tree-shakeable, type-strong, SSR-friendly, and battle-tested across hundreds of projects — our re-implementations are not.

**The Pattern:**

- Before writing any composable, search [vueuse.org/functions](https://vueuse.org/functions)
- Import from `@vueuse/core` (already in the workspace catalog as `catalog:`)
- Compose VueUse primitives — wrap them only when you need a project-specific default
- Never re-implement what VueUse exports; the version is tree-shaken if unused
- When you spot a custom composable that VueUse can replace, delete it and migrate callers

**When to write your own:** VueUse has no equivalent, or its behavior conflicts with a hard requirement. Document the reason in a comment so future readers don't replace it back. When you do roll your own, follow [[vueuse-style-composables]].

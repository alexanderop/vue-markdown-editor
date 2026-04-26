---
status: executed
created: 2026-04-26
executed: 2026-04-26
spec: docs/feature-specs/brainstorm-editor-mvp.md
---

# Plan: Brainstorm Editor — MVP (executed)

Split-view markdown scratchpad: CodeMirror 6 source pane, Comark preview pane, localStorage autosave, Linear-styled visuals. Solo-dev, single-doc, no toolbar, no AI.

## What shipped

- `useMarkdownEditor`, `useComarkPreview`, `usePersistedDoc` composables under `apps/web/src/composables/`.
- `<EditorPane>`, `<PreviewPane>` humble components and `<EditorScratch>` controller page.
- Comark config in `apps/web/src/shared/comark.ts`; CM themes in `apps/web/src/lib/cmThemes.ts`.
- VueUse `useStorage` (`vme:scratch`) + `useDebounceFn` (~40ms doc → preview).
- Theme reuses existing `useTheme()`; CM theme swapped via `Compartment.reconfigure`.
- E2E spec at `apps/web/e2e/editor.spec.ts`.

## Durable knowledge it produced

The engine principles already covered the shape — this plan shipped the first product surface but generated no new principles. Read these instead of re-reading the plan:

- [[principles/codemirror-imperative-shell]]
- [[principles/comark-rendering-pipeline]]
- [[principles/vue-layered-components]]
- [[principles/vueuse-style-composables]]
- [[codebase/style-guide]] (composable + test sections)

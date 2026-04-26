# @vme/ui — local shadcn-style component library

Workspace package at `packages/ui`. Components are authored locally (NOT
copied verbatim from shadcn-vue and NOT installed as a dep) but adopt the
shadcn-vue design language and patterns.

## Conventions

- **Naming:** `Base` prefix on every public component (`BaseButton`,
  `BaseInput`, `BaseLabel`, `BaseCard`, `BaseCardHeader`, …).
- **Slot tags:** every root element gets `data-slot="base-<name>"` for
  selector hooks (e.g. `BaseCardHeader` adjusts layout when it has a
  `[data-slot="base-card-action"]` child).
- **Class merging:** `cn(...)` (from `./lib/utils`) wraps `twMerge(clsx(...))`.
  Every component accepts a `class?: HTMLAttributes['class']` prop and merges
  it AFTER its base classes so consumers can override.
- **Variants:** `class-variance-authority`. Co-locate the `cva()` config in
  `variants.ts` next to the component and re-export `<Name>Variants` type.
- **Headless primitives:** none of the starter components use `reka-ui`.
  Reach for it only when behavior actually requires it (Dialog, Dropdown,
  Combobox, etc.) — for plain styled wrappers (Button/Input/Label/Card),
  native HTML elements are simpler and lighter.

## Theming

Design tokens live in `packages/ui/src/styles.css` (neutral palette, light +
dark via `.dark` class). Consumer apps must `@import '@vme/ui/styles.css'`
**after** `@import 'tailwindcss';` and **after** the `@source` directive
that points at `packages/ui` — see [[tailwind-v4-monorepo-source]].

## Adding a component

1. Create `packages/ui/src/components/<name>/Base<Name>.vue`.
2. If it has variants, add `variants.ts` with a `cva()` and a
   `Base<Name>Variants` type.
3. Create an `index.ts` barrel that exports the component and (optionally)
   the variants.
4. Re-export from `packages/ui/src/index.ts`.

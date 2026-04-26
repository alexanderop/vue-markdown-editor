# Tailwind v4 + monorepo: explicit `@source` for cross-package scanning

Tailwind v4 auto-detects template files **only within the project where the
CSS entry lives**. In this pnpm workspace, `apps/web/src/styles/main.css`
imports `tailwindcss` but does NOT see `packages/ui/src/**` by default — so
classes used only inside `@vme/ui` components would silently be missing
utilities at runtime.

Fix: add `@source` after `@import 'tailwindcss';`:

```css
@import 'tailwindcss';
@source "../../../../packages/ui/src/**/*.{vue,ts}";
@import '@vme/ui/styles.css';
```

Path is resolved relative to the CSS file. Apply this rule to any new
workspace package whose components are consumed by `@vme/web`.

Verify by curling the Vite-served CSS and checking that a utility unique to
the package shows up — for example `has-data-[slot=base-card-action]` only
exists inside `BaseCardHeader.vue`.

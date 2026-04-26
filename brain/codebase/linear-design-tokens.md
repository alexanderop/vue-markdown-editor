# Linear Design Tokens

Concrete tokens distilled from Linear's live DOM, brand guidelines, and design-system writeups. Pair with the philosophy in [[../principles/linear-design-style]].

> Linear's design system is called **Orbiter**. It uses Radix Primitives + styled-components under the hood. Themes are generated in **LCH**, not HSL, so lightness is perceptually uniform across hues.

## Typography

### Families

| Role      | Family                                             | Notes                                              |
| --------- | -------------------------------------------------- | -------------------------------------------------- |
| UI / body | `Inter Variable`                                   | Single variable file, weight axis 100–900          |
| Display   | `Inter Display` (Inter's display optical-size cut) | Headings only — slightly tighter, more expressive  |
| Code      | `Berkeley Mono`                                    | Replace with `JetBrains Mono` if licensing matters |

```css
--font-sans: 'Inter Variable', 'Inter', system-ui, sans-serif;
--font-display: 'Inter Display', 'Inter Variable', system-ui, sans-serif;
--font-mono: 'Berkeley Mono', 'JetBrains Mono', ui-monospace, monospace;
```

Enable OpenType features: `font-feature-settings: "cv11", "ss01", "ss03";` for Inter's friendlier digit/letter alternates.

### Scale

Linear uses a coarse type scale, not the typical 12-step. Most UI lives at 13px.

| Token        | Size | Line-height | Weight | Usage                                 |
| ------------ | ---- | ----------- | ------ | ------------------------------------- |
| `text-xs`    | 11px | 14px        | 510    | Metadata, timestamps                  |
| `text-sm`    | 12px | 16px        | 510    | Secondary labels                      |
| `text-base`  | 13px | 18px        | 450    | **Default UI body** (most of the app) |
| `text-md`    | 14px | 20px        | 450    | Forms, dialogs                        |
| `text-lg`    | 16px | 24px        | 450    | Long-form text                        |
| `text-xl`    | 18px | 24px        | 540    | Sub-headers                           |
| `text-2xl`   | 22px | 28px        | 590    | Page titles                           |
| `display-md` | 28px | 32px        | 590    | Marketing H2                          |
| `display-lg` | 40px | 44px        | 670    | Marketing H1                          |
| `display-xl` | 62px | 68px        | 720    | Hero                                  |

Letter-spacing: `-0.012em` for display sizes ≥22px; `0` below.

Inter Variable lets you pick non-standard weights (`450`, `510`, `540`, `590`, `670`, `720`). Linear leans on these — they sit between Regular and Medium / Medium and Semibold for finer hierarchy.

## Color

### Foundation

Linear's dark mode is the canonical experience. Pure `#000` is never used.

| Token            | Light (Mercury) | Dark (Nordic) | Usage                         |
| ---------------- | --------------- | ------------- | ----------------------------- |
| `bg`             | `#F7F8F8`       | `#08090A`     | App background                |
| `bg-elevated`    | `#FFFFFF`       | `#0F1011`     | Cards, popovers               |
| `bg-overlay`     | `#FFFFFFEE`     | `#1C1D1FEE`   | Menus, modals (with backdrop) |
| `border`         | `#E5E5E6`       | `#23252A`     | Dividers, inputs              |
| `border-strong`  | `#D0D6E0`       | `#2E2F33`     | Hovered/focused               |
| `text`           | `#08090A`       | `#F7F8F8`     | Primary                       |
| `text-secondary` | `#62666D`       | `#8A8F98`     | Labels, descriptions          |
| `text-tertiary`  | `#8A8F98`       | `#62666D`     | Placeholders, disabled        |

Brand seed colors per Linear's guidelines:

- **Mercury White** `#F4F5F8`
- **Nordic Gray** `#222326`

### Accent

Linear's signature blue is desaturated and sits at low saturation, not vivid.

```css
--accent: #5e6ad2; /* primary brand */
--accent-hover: #6b77e0;
--accent-active: #4d58bf;
--accent-soft: #5e6ad21a; /* 10% — backgrounds for selected rows */
```

### Status palette

Pulled from Linear's live DOM. Soft, never neon.

| Status  | Hex       | Use                      |
| ------- | --------- | ------------------------ |
| success | `#89D196` | Done, merged, completed  |
| info    | `#55CDFF` | In progress              |
| warning | `#FFC47C` | Blocked, needs attention |
| danger  | `#EB5757` | Failed, destructive      |
| purple  | `#8FA4FF` | Triage, custom labels    |
| pink    | `#F79CE0` | Custom labels            |

### LCH theme generation

Define **three** inputs; derive everything else:

```css
:root {
  --base: lch(98% 0 0); /* canvas */
  --accent: lch(58% 60 270); /* brand */
  --contrast: lch(8% 5 270); /* text */
}

.dark {
  --base: lch(8% 2 270);
  --accent: lch(64% 50 270);
  --contrast: lch(98% 0 0);
}
```

Why LCH: same `L` value reads as the same lightness across hues. HSL doesn't — `hsl(60, 100%, 50%)` (yellow) is far brighter than `hsl(240, 100%, 50%)` (blue) at "the same" lightness.

## Spacing

4px base, 8px primary rhythm. Use multiples; don't invent in-betweens.

```css
--space-0: 0;
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
```

**Component padding rules of thumb:**

- Buttons: `4px 12px` (sm), `6px 14px` (md), `8px 16px` (lg)
- Inputs: `8px 12px`
- Menu items: `6px 8px`
- Card: `16px` or `20px`
- Section spacing: `24px` or `32px`

## Radius

Small everywhere. Linear doesn't do pill shapes outside avatars.

```css
--radius-xs: 3px; /* tags, badges */
--radius-sm: 4px; /* buttons, inputs */
--radius-md: 6px; /* small cards */
--radius-lg: 8px; /* popovers, menus */
--radius-xl: 12px; /* modals, large cards */
--radius-2xl: 16px; /* hero panels */
--radius-full: 9999px;
```

## Shadows / elevation

Stacked low-opacity layers — never a single big blur.

```css
--shadow-xs: 0 1px 2px rgb(0 0 0 / 0.04);
--shadow-sm: 0 1px 2px rgb(0 0 0 / 0.04), 0 2px 4px rgb(0 0 0 / 0.04);
--shadow-md: 0 2px 4px rgb(0 0 0 / 0.05), 0 4px 8px rgb(0 0 0 / 0.06);
--shadow-lg: 0 4px 8px rgb(0 0 0 / 0.06), 0 12px 24px rgb(0 0 0 / 0.1);
--shadow-xl: 0 8px 16px rgb(0 0 0 / 0.08), 0 24px 48px rgb(0 0 0 / 0.16);
```

Dark mode: bump the rgb to a near-black (`rgb(0 0 0)`) and increase opacity ~1.5×, or use a soft inner highlight (`box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.04)`) for the "lit edge" Linear gets on its panels.

## Motion

Fast and snappy. Anything over 250ms feels sluggish.

| Token              | Duration | Use                              |
| ------------------ | -------- | -------------------------------- |
| `duration-instant` | 80ms     | Hover, focus rings, active state |
| `duration-fast`    | 120ms    | Tooltips, dropdown reveal        |
| `duration-base`    | 180ms    | Most transitions                 |
| `duration-slow`    | 240ms    | Modals, page-level               |

```css
--ease-out: cubic-bezier(0.16, 1, 0.3, 1); /* default — overshoots gently */
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
--ease-spring: linear(0, 0.5 25%, 1.05 60%, 1); /* CSS linear() — bouncy */
```

Rules:

- **Never** animate layout/scroll. Only `transform`, `opacity`, `filter`, `color`.
- Respect `prefers-reduced-motion: reduce` — drop to 0ms.
- No spinners on the happy path; show optimistic state and reconcile.

## Components — common dimensions

Quick reference to keep parts feeling like Linear.

| Element         | Height | Padding-x | Font | Radius |
| --------------- | ------ | --------- | ---- | ------ |
| Button (sm)     | 24px   | 8px       | 12px | 4px    |
| Button (md)     | 28px   | 12px      | 13px | 6px    |
| Button (lg)     | 32px   | 14px      | 14px | 6px    |
| Input           | 32px   | 12px      | 14px | 6px    |
| Menu item       | 28px   | 8px       | 13px | 4px    |
| Tag / chip      | 20px   | 6px       | 11px | 3px    |
| Toolbar         | 40px   | 12px      | —    | —      |
| Sidebar         | —      | —         | —    | —      |
| Sidebar (width) | 240px  |           |      |        |

## Icons

- 16px default, 20px for primary actions, 14px for inline metadata
- 1.5px stroke (Lucide / Tabler / Phosphor — pick **one**, never mix)
- Always render at integer pixel sizes; never scale via percentages

## Focus rings

```css
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 1px;
  border-radius: inherit;
}
```

Never remove focus rings. Linear's are subtle but always present.

## What this codebase ships today

- **Base components:** `@vme/ui` (`Base*` prefix) — see [[ui-package-layout]]. `BaseButton` sizes are `sm` (24) / `md` (28, default) / `lg` (32) / `icon`; `size="default"` is a deprecated runtime alias for `md` (one-release migration window).
- **Tokens:** wired into `packages/ui/src/styles.css` via `@theme inline`. Color (Mercury / Nordic), `--accent: #5E6AD2`, the type scale (11/12/13/14/16/18/22 with weights 510/510/450/450/450/540/590), radius (3/4/6/8/12/16), stacked low-opacity shadows, and motion (`--duration-instant/fast/base/slow`, `--ease-out`) are all live as Tailwind utilities.
- **Destructive shade:** `#C92F2F` for button bg + white text (passes WCAG AA at ~5.3:1). `#EB5757` is preserved as `--destructive-soft` for status-icon use.
- **Fonts:** Inter Variable loaded via `@import url('https://rsms.me/inter/inter.css');` at the top of `apps/web/src/styles/main.css`. Mono falls back to `JetBrains Mono` then `ui-monospace`. The `@import` lives in the consumer (not in `@vme/ui/styles.css`) so PostCSS keeps it as the first statement.
- **Dark mode:** dark-first. `apps/web/src/composables/useTheme.ts` wraps VueUse `useColorMode` with `selector: 'html'`, `attribute: 'class'`, default `'dark'`, persisted to `localStorage` under `'vme-theme'`.
- **Focus rings:** baked into each Base component via `focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-1`. A global `*:focus-visible` rule in the base layer was tried first and removed — Tailwind's `utilities` layer always wins over `base`, so a per-component `outline-none` would silently strip the global ring. Per-component utilities sit in the same layer and compose correctly.

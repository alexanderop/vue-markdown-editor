# Linear Design Style

Linear's web app is the bar for software design craft. When designing UI in this codebase, borrow from this playbook. The pieces compose into a single coherent feel — they are not a checklist.

## First principles

- **Quality is the first principle.** Every other metric flows from it. Quality is what you _feel_ — recognizable but unnameable. The spec is the floor, never the finish line.
- **Design for someone, not everyone.** Pick a specific user and make their workflow effortless. Universal appeal is a tax that dulls everything.
- **Be opinionated.** Flexibility creates chaos at scale. Pick one really good way; eliminate the choice when the choice doesn't earn its place.
- **Speed is a feature.** Sub-100ms feedback, optimistic UI, instant search. The microseconds across hundreds of daily interactions _are_ the "feels fast" perception.
- **Invisible details compound.** Diagonal safe-zones in submenus, sidebar icon alignment, submenu open geometry. None noticeable alone; together they are the whole feel.

## Visual system

- **Type:** `Inter Variable` for body, `Inter Display` for headings, `Berkeley Mono` for code. Default UI lives at **13px**. Use Inter's variable axis for non-standard weights (450, 510, 540, 590) — finer hierarchy than the usual 400/500/600 jumps.
- **Color:** Generate themes in **LCH**, not HSL — uniform perceptual lightness across hues. Define base, accent, contrast; derive the rest. Monochrome spine, accent reserved for brand and state. Never pure `#000` — Linear's dark canvas is `#08090A`. Their accent is a desaturated blue (~`#5E6AD2`).
- **Contrast:** High contrast text. Darken neutrals in light mode, lighten them in dark mode. Dark-mode-first.
- **Density:** Tight but breathing. 4px base spacing, 8px primary rhythm. Sweat vertical and horizontal alignment of every label, icon, and button — misalignment is the loudest noise in a quiet UI.
- **Radius:** Small. 4–8px for components, 12–16px for cards/modals. Pills only on avatars.
- **Motion:** 80–240ms. Default `cubic-bezier(0.16, 1, 0.3, 1)`. Animate `transform`/`opacity` only; respect `prefers-reduced-motion`.
- **Decoration:** Restrained. Stacked low-opacity shadows, subtle gradients, occasional glassmorphism. No decoration without purpose.

Concrete token values live in [[../codebase/linear-design-tokens]].

## Layout & flow

- **Sequential reading.** Top-to-bottom, left-to-right. No zig-zag, no carousels.
- **Structured chrome.** Header (filters), sidebar (navigation), side panel (meta), body (content). Every view (list, board, timeline) reuses the same scaffold.
- **One subject per section. One CTA per section.** Anything more is a thinking tax on the user.

## Interaction

- **Keyboard-first.** Every action one keystroke. `Cmd+K` global command, `/` filter, single letters for state. Mouse is fallback.
- **Optimistic UI.** Mutations apply instantly; sync reconciles in the background. No spinners on the happy path.
- **Local-first data** when feasible — IndexedDB + sync. The UI never waits on the network.
- **Discoverability through context.** Right-click menus surface shortcuts so users learn them passively.

## Anti-patterns

- A/B tests and metrics driving design decisions — develop intuition instead.
- Settings panels as the answer to "users want flexibility" — pick the right default and defend it.
- Drag-and-drop where structured input is faster.
- Loading states where optimistic UI works.
- "Universal" design that compromises in every direction.

Pairs with [[experience-first]] — that principle sets the target; this one supplies the playbook.

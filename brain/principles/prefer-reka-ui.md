# Prefer Reka UI For Behaviour-Heavy Primitives

Reach for [`reka-ui`](https://reka-ui.com) (Vue port of Radix UI primitives) before hand-rolling any component whose value is **behaviour** — focus, keyboard nav, ARIA, portalling, dismiss/outside-click, modal scroll lock, roving tabindex, popper positioning, presence/animation, controlled+uncontrolled state. If Reka has it, use Reka.

**Why:** These behaviours are deceptively hard. WAI-ARIA patterns alone are pages of spec; getting a Dialog right means focus trap + scroll lock + `aria-labelledby`/`describedby` wiring + Esc + outside click + restoring focus on close + portalling without breaking SSR. Re-implementing this in `@vme/ui` duplicates work, ships bugs, and rots — Reka has tests, contributor pressure, and Radix's accessibility lineage. Pairs with [[prefer-deep-modules]]: a Reka primitive is a textbook deep module — small interface (`<DialogRoot>` / `<DialogTrigger>` / `<DialogContent>`) hiding a _huge_ implementation.

## What Reka ships (use this list as the trigger)

Accordion, AlertDialog, AspectRatio, Autocomplete, Avatar, Calendar, Checkbox, Collapsible, ColorPicker (+ Area/Field/Slider/Swatch), Combobox, ContextMenu, DatePicker (+ Field/Range), Dialog, DropdownMenu, Editable, HoverCard, Label, Listbox, Menubar, NavigationMenu, NumberField, Pagination, PinInput, Popover, Progress, RadioGroup, Rating, ScrollArea, Select, Separator, Slider, Splitter, Stepper, Switch, Tabs, TagsInput, TimeField, Toast, Toggle, ToggleGroup, Toolbar, Tooltip, Tree, VisuallyHidden — see `node_modules/reka-ui/dist` exports.

If a designer's spec maps to one of those names, the answer is Reka. No discussion.

## How devs use it

### 1. Compound parts, not monolith props

Every primitive is a set of named parts you compose:

```vue
<DialogRoot v-model:open="open">
  <DialogTrigger>Open</DialogTrigger>
  <DialogPortal>
    <DialogOverlay />
    <DialogContent>
      <DialogTitle>…</DialogTitle>
      <DialogDescription>…</DialogDescription>
      <DialogClose>Close</DialogClose>
    </DialogContent>
  </DialogPortal>
</DialogRoot>
```

State flows via context (`injectDialogRootContext`); you don't pass it manually.

### 2. `as` and `asChild` — composition, not config

Every primitive accepts `as` (override the rendered tag/component) and `asChild` (merge into the immediate child instead of rendering a wrapper). This is how you keep your `BaseButton` styles on a `DialogTrigger`:

```vue
<DialogTrigger as-child>
  <BaseButton variant="primary">Open</BaseButton>
</DialogTrigger>
```

`asChild` clones props/handlers/refs onto the slot child — no extra DOM node, no style fights.

### 3. Controlled or uncontrolled, never both

Pass `v-model:open` for controlled, `default-open` for uncontrolled. Mixing them is a bug.

### 4. v-model props are typed

`DialogRootProps` / `DialogRootEmits` are exported. Forward them with `useForwardPropsEmits` when you build a wrapper:

```ts
import { type DialogRootEmits, type DialogRootProps, useForwardPropsEmits } from 'reka-ui'
const props = defineProps<DialogRootProps>()
const emits = defineEmits<DialogRootEmits>()
const forwarded = useForwardPropsEmits(props, emits)
```

### 5. Portalling and presence

`*Portal` teleports content to `body` (or a custom target via `<ConfigProvider>`). `*Content` participates in Reka's `Presence` system — animate with `data-state="open|closed"` selectors, no `v-if`/`v-show` race conditions.

## How it slots into `@vme/ui`

Per [[ui-package-layout]], `@vme/ui` is our shadcn-style local library with `Base*` components. The pattern when the component has _behaviour_:

1. Build `BaseDialog` (etc.) as a **thin styled shell** over Reka parts — one `Base*` component per Reka part, mapping 1:1 (`BaseDialog` → `DialogRoot`, `BaseDialogContent` → `DialogContent`, …).
2. Use `cn()` + `cva()` for styling exactly like the other `Base*` components; pass through with `as-child` or by spreading `useForwardPropsEmits`.
3. Re-export the Reka types alongside (`BaseDialogProps = DialogRootProps`).
4. Keep `data-slot="base-…"` selector hooks for layout — Reka's own `data-state` attributes are additive and great for animation hooks.

**Don't** wrap Reka primitives that have no styling work to do — just re-export them. **Don't** add Reka to `BaseButton` / `BaseInput` / `BaseLabel` / `BaseCard` — native elements stay native. The line is _behaviour_, not "every component".

## When NOT to use Reka

- Pure styling wrappers (Button, Card, Badge, Input without combobox behaviour).
- Layout primitives we control fully (Stack, Grid, Spacer).
- Domain-specific editor surfaces backed by CodeMirror / ProseMirror — those have their own imperative shells (see [[codemirror-imperative-shell]]).
- A component where Reka's behaviour conflicts with a hard product requirement; document the conflict in a comment so a future reader doesn't migrate it back.

## Anti-patterns

- Re-implementing focus trap / scroll lock / outside-click in `@vme/ui` "because we only need a small piece." You don't — pull the primitive.
- Wrapping Reka so deeply that consumers can't reach `as-child` or the Reka context. Forward, don't hide.
- Skipping `*Portal` to "keep DOM tidy" — overlays then clip inside `overflow:hidden` ancestors and z-index fights ensue.
- Treating Reka as a styled library. It ships zero styles by design; _you_ style it.

Pairs with [[prefer-deep-modules]] (Reka primitives are the canonical deep module), [[prefer-vueuse]] (same rule, different layer — don't re-implement what a battle-tested library already exports), [[boundary-discipline]] (Reka _is_ the accessibility boundary; concentrate ARIA there).

Source: `reka-ui` v2.9.x — <https://reka-ui.com>, ports of Radix UI's WAI-ARIA-compliant primitives.

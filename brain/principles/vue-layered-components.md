# Vue Layered Components

Split Vue features into three layers by responsibility: **Humble Components** (presentation), **Composables** (logic), **Controller Components** (wiring). Each layer has one job and depends only inward.

**Why:** When presentation, state, and logic tangle in a single `.vue` file, every change touches everything. Layering makes each piece testable in isolation, swappable, and self-explanatory at a glance. The layers also encode where logic _belongs_ — so the question "where does this go?" has one answer, not five.

## The layers

- **Humble Components** — template + props/emits only. No fetching, no business rules, no global state. Props down, events up. Reusable, trivially testable, often dumb-by-design.
- **Composables** — the logic layer. Prefer a _thin reactive shell_ over plain functions: pure logic in `.ts`, `ref`/`watch` glue in `useX.ts`. State stores are composables with module-scoped state.
- **Controller Components** — orchestrate. Pull state from composables, pass to Humble children, forward events back. Thin by construction; if a Controller grows logic, it belongs in a composable.

## Where to cut

Comprehension is the cut criterion, not line count.

- **Cut by intent divergence** — when two prop sets are used mutually exclusively (`chart-*` vs `table-*`), they are two components wearing one name. Split them.
- **Cut by branch weight** — a heavy `v-if/v-else` becomes two named components; the parent reads like a sentence.
- **Cut by iteration** — extract `v-for` bodies into a list-item component when the body has its own state or template depth.
- **Merge when a child only forwards** — a child that re-emits every event and re-binds every prop earns nothing; inline it back into the parent.
- **Name tells the story** — if the component name doesn't tell a reader what's inside, the cut is wrong. Rename or recut.

## Anti-patterns

- Business logic inside `<script setup>` of a leaf component.
- Composables that import Vue components or touch the DOM.
- Controllers with their own conditionals, loops, or transforms — that's logic; move it.
- Splitting for size alone; merging "to reduce files" when intent actually diverges.

Pairs with [[boundary-discipline]] — pure logic lives below the reactive shell, the same way it lives below the framework boundary. Pairs with [[subtract-before-you-add]] — Insider Trading (inlining a forwarding child) is subtraction; do it before adding new props.

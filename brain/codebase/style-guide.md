# Style Guide (Vue + TypeScript)

Adapted from the TypeScript Style Guide ([typescript-style-guide.com](https://typescript-style-guide.com)) — only the parts that map to a Vue 3 / `<script setup>` codebase. The React-specific sections are translated to their Vue equivalents (hooks → composables, JSX props → `defineProps`, etc.).

> **Source of truth.** When the guide and the lint config disagree, the lint config wins — update this doc.

## TLDR

1. Embrace `as const` and `as const satisfies` for type-safe immutable constants.
2. Strive for `Readonly` / `ReadonlyArray` data.
3. Make most object properties **required**; reach for discriminated unions before optional fields.
4. Avoid type assertions (`x as T`) and non-null assertions (`x!`).
5. Functions: pure, single-responsibility, single object arg.
6. Naming is consistent and readable.
7. **Named exports only** (except where the framework forces a default).
8. Organise by feature; collocate.

## Types

### Inference vs. explicit

Explicitly declare types **only when it narrows**. Let TS infer everything else.

```ts
// ❌ redundant
const isActive: boolean = false
const employees = new Map<string, number>([['Gabriel', 32]])

// ✅
const isActive = false
const employees = new Map([['Gabriel', 32]])

// ✅ explicit because inference would widen
const employees = new Map<string, number>()
type UserRole = 'admin' | 'guest'
const role = ref<UserRole>('admin')
```

### Immutability

- Function args that aren't mutated → `Readonly<T>` / `ReadonlyArray<T>`.
- Return new arrays/objects instead of mutating in place.
- Keep data flat.

```ts
const removeFirstUser = (users: ReadonlyArray<User>) =>
  users.length === 0 ? users : users.slice(1)
```

### Required > optional

Most properties should be required. If a property is sometimes-present, model it with a discriminated union — don't sprinkle `?`.

```ts
// ❌
type User = { id?: number; email?: string; adminPermissions?: string[] }

// ✅
type AdminUser = {
  role: 'admin'
  id: number
  email: string
  adminPermissions: ReadonlyArray<string>
}
type GuestUser = { role: 'guest'; temporaryToken: string }
type User = AdminUser | GuestUser
```

### Discriminated unions

The single most useful TS feature. Use them for:

- Component props with mutually exclusive variants (loading / success / error).
- Function args with mutually exclusive call shapes.
- Domain state that today is encoded as a pile of booleans.

The discriminator (`kind`, `status`, `type`, …) is required on every variant. The exhaustiveness check via `switch` is the payoff.

### `as const satisfies`

Pin a narrowed literal type to a constant **and** validate it against a wider type at the same time.

```ts
type UserRole = 'admin' | 'editor' | 'moderator' | 'viewer' | 'guest'

const DASHBOARD_ACCESS_ROLES = [
  'admin',
  'editor',
  'moderator',
] as const satisfies ReadonlyArray<UserRole>

type OrderStatus = { pending: 'pending' | 'idle'; fulfilled: boolean; error: string }
const IDLE_ORDER = {
  pending: 'idle',
  fulfilled: true,
  error: 'Shipping Error',
} as const satisfies OrderStatus
```

### Template literal types

Encode string patterns in the type system instead of widening to `string`:

```ts
type Version = `v${number}.${number}.${number}`
type ApiRoute = 'users' | 'posts' | 'comments'
type ApiEndpoint = `/api/${ApiRoute}`
type Color = `${'blue' | 'red' | 'gray'}-${50 | 100 | 200}` | `#${string}`
```

### `any`, `unknown`, and assertions

- `any` is banned. Use `unknown` and narrow with a type guard.
- `as T` (type assertion) is banned. Define the type properly.
- `x!` (non-null assertion) is banned. Narrow with a guard or fix the type.
- `@ts-ignore` is banned. Use `@ts-expect-error` **with a description**.

```ts
// ✅
const isNumber = (n: unknown): n is number => typeof n === 'number'

// ✅
// @ts-expect-error: third-party types claim arg is `string` but runtime accepts `number` — see #1234.
createUser(42)
```

### `type` over `interface`

Define all types via `type`. Use `interface` only for declaration merging (and disable the lint locally).

### `Array<T>` over `T[]`

Generic syntax is more uniform with `ReadonlyArray<T>`, `Map<K, V>`, etc.

### Type imports separated

```ts
// ❌ might pull runtime code
import { User } from '@/types'
// ✅ erased at compile time
import type { User } from '@/types'
```

### Generated types over hand-rolled

For OpenAPI / GraphQL / DB schemas, generate types from the contract — never copy them by hand.

## Functions & composables

### Single object arg

```ts
// ❌
transformUserInput('client', false, 60, 120, null, true, 2000)

// ✅
transformUserInput({
  method: 'client',
  isValidated: false,
  minLines: 60,
  maxLines: 120,
  defaultInput: null,
  shouldLog: true,
  timeout: 2000,
})
```

Exception: a single primitive arg (`isNumber(value)`).

### Args as discriminated unions

If the args object has truly optional fields, model the call shapes as a union:

```ts
type StatusParams =
  | { status: 'success'; data: Products; title: string }
  | { status: 'loading'; time: number }
  | { status: 'error'; error: string }
```

### Return types

Be explicit on the **outside** (public APIs, exported functions, libraries). Let TS infer on the **inside**.

### Composables (Vue equivalent of React hooks)

- Filename `useFoo.ts`, exported as `useFoo`.
- Must import a reactivity API from `vue`/`@vueuse/*`/`pinia`/`vue-router`/`vue-i18n` (otherwise it's a util, not a composable).
- Must return an **object**, never a tuple/array. Vue has no `useState` symmetry to preserve.

```ts
// ❌
export const useGetProducts = () => [products, errors]
// ✅
export const useGetProducts = () => ({ products, errors })
```

## Variables

### `as const`

Default to `as const` for objects, arrays, and template literals you don't intend to mutate.

```ts
const FOO = { x: 50, y: 130 } as const
const ROLES = ['admin', 'editor'] as const
const MSG = `Limit is ${LIMIT}.` as const
```

### No enums

`enum` is banned. Use:

- Literal union types whenever possible.
- `as const` arrays when looping.
- `as const` objects when enumerating.

```ts
type UserRole = 'guest' | 'moderator' | 'administrator'

const USER_ROLES = ['guest', 'moderator', 'administrator'] as const
type UserRole = (typeof USER_ROLES)[number]

const COLORS = { primary: '#B33930', brand: '#9C0E7D' } as const
type ColorKey = keyof typeof COLORS
```

### Boolean unions, not flags

```ts
// ❌
const isPending, isProcessing, isConfirmed, isExpired
// ✅
type UserStatus = 'pending' | 'processing' | 'confirmed' | 'expired'
```

### `null` vs `undefined`

- `null` → "explicitly no value" (assignment, return value).
- `undefined` → "value doesn't exist" (omitted form fields, partial payloads).

## Naming

| Kind                 | Convention                                                            |
| -------------------- | --------------------------------------------------------------------- |
| Locals               | `camelCase` — `products`, `productsFiltered`                          |
| Booleans             | `is*` / `has*` / `can*` / `should*` — `isDisabled`, `hasProduct`      |
| Constants            | `CONSTANT_CASE` — `FEATURED_PRODUCT_ID`                               |
| Const objects/arrays | `CONSTANT_CASE` + `as const` (+ `satisfies` if a type exists)         |
| Functions            | `camelCase` — `filterProductsByType`                                  |
| Types                | `PascalCase` — `OrderStatus`                                          |
| Generics             | `T`-prefix + descriptive — `TRequest`, `TFirst` (no bare `T`/`K`/`U`) |
| Vue components       | `PascalCase` — `BaseButton.vue`, `ProductItem.vue`                    |
| Component prop type  | `[ComponentName]Props` — `ProductItemProps`                           |
| Composables          | `useFoo` — returns an object                                          |
| Acronyms             | First letter only — `Url` not `URL`, `Faq` not `FAQ`                  |
| Custom events        | `kebab-case` — `@user-selected="..."`                                 |
| Event-handler props  | `onUserSelected` (callback prop, kebab in template)                   |
| Event handler impls  | `handleUserSelected` (the function the prop points at)                |

```vue
<!-- ✅ -->
<MyComponent @user-selected="handleUserSelected" />
```

## Vue components

### Container vs. UI vs. design-system

- **Page / Container** — owns business logic and data fetching. Postfix `Page` or `Container` (`ProductsPage.vue`, `AddUserContainer.vue`).
- **Feature UI** — pure presentational, scoped to one feature folder. No API calls.
- **Design system** — global, repo-wide reusables. Lives in `@vme/ui` with `Base*` prefix (see [[ui-package-layout]]). Never depends upward on app code.

### Props

- Type alias named `[ComponentName]Props`.
- Most props required; optional ones rare. If many use cases need different shapes → discriminated union.
- **Don't** seed local state from props. If you must, prefix with `initial`: `initialProductName`.
- Pass only what's needed; don't forward whole objects when a child needs one field.

### Compound components

When sub-components only make sense together (`PriceList` + `PriceList.Item`), export with the type intersection trick:

```ts
const PriceListRoot = ({ children }) => /* ... */
const PriceListItem = ({ title, amount }) => /* ... */

export const PriceList = PriceListRoot as typeof PriceListRoot & {
  Item: typeof PriceListItem
}
PriceList.Item = PriceListItem
```

(Less common in Vue — slots usually fit better.)

### State location

1. Prefer URL state for filters/sorting/pagination — don't sync URL with local state.
2. Server state → TanStack Query / similar.
3. Cross-cutting client state → Pinia or `inject`/`provide`. Reach last.

UI components show derived state and emit events. Business logic lives in container components, composables, or the store.

## Comments

- Default: **no comment**. Name things well.
- Explain **why**, not what — hidden constraints, workarounds, planned removals.
- Use TSDoc on public APIs (libraries, packages, config types).

```ts
// ✅
// Use FFT to minimize information loss — https://github.com/dntj/jsfft#usage
const frequencies = signal.fft()
```

## Source organisation

### Imports

- **Relative** (`./sortItems`) within the same feature — keeps the feature movable.
- **Absolute** (`@/lib/x`, `@vme/ui`) for everything else.
- Auto-sorted by tooling.

### Project structure

Group by **feature**, collocate. Deep nesting is fine.

```
apps/web/src/
├─ common/          # Truly cross-app; used sparingly
│  ├─ components/
│  ├─ consts/
│  ├─ composables/
│  └─ types/
├─ modules/         # Feature folders (or features/)
│  └─ ProductsPage/
│     ├─ api/
│     │  └─ useGetProducts/
│     ├─ components/
│     │  └─ ProductItem/
│     ├─ utils/
│     │  └─ filterProductsByType/
│     └─ index.vue
└─ router/          # Routes only — no business logic
```

A component shared by two pages → promote to `common/components/`. Don't pre-promote.

## Tests

(See [[../principles/vitest-browser-vs-playwright]] and [[ui-component-tests]] for Vue-specific guidance.)

- AAA structure (Arrange / Act / Assert).
- Test behaviour, not implementation.
- Black-box queries, prioritised: role > label > placeholder > text > display value > alt > title > test ID.
- Test description: `it('should ... when ...')`.
- No snapshots except for design-system invariants.
- Don't re-test the framework. Don't aim for 100% coverage.

## Enforcement

What the lint config enforces today vs. what stays a convention:

### Enforced by oxlint / ESLint

| Rule from this guide                          | Lint rule                                                               |
| --------------------------------------------- | ----------------------------------------------------------------------- |
| No `any`                                      | `typescript/no-explicit-any`                                            |
| No type assertions (`x as T`)                 | `@typescript-eslint/consistent-type-assertions: never` (eslint)         |
| No non-null assertions (`x!`)                 | `typescript/no-non-null-assertion`                                      |
| `@ts-expect-error` only, with description     | `typescript/ban-ts-comment`                                             |
| `type` over `interface`                       | `typescript/consistent-type-definitions: type`                          |
| `Array<T>` over `T[]`                         | `typescript/array-type: { default: generic }`                           |
| Type imports separated                        | `typescript/consistent-type-imports`                                    |
| `as const` literal narrowing                  | `typescript/prefer-as-const`                                            |
| No `enum`                                     | `no-restricted-syntax: TSEnumDeclaration` (eslint)                      |
| No `else` / `else-if` (early-return instead)  | `no-restricted-syntax: IfStatement[alternate]` (eslint)                 |
| Naming (booleans, constants, types, generics) | `typescript/naming-convention`                                          |
| Named exports                                 | `import-x/no-default-export`                                            |
| Component PascalCase + matches filename       | `vue/component-definition-name-casing`, `vue/match-component-file-name` |
| Prop camelCase, attribute kebab               | `vue/prop-name-casing`, `vue/attribute-hyphenation`                     |
| Custom event kebab-case                       | `vue/custom-event-name-casing`                                          |
| Composable filename imports Vue/VueUse        | `local-rules/composable-must-use-vue`                                   |
| Composable returns an object                  | `local-rules/composable-returns-object`                                 |
| Props type alias `[ComponentName]Props`       | `local-rules/vue-props-type-name`                                       |
| `@event="handle*"` impl prefix                | `local-rules/vue-handler-prefix`                                        |
| Extract complex `if` conditions               | `local-rules/extract-condition-variable`                                |
| Test description shape, AAA                   | `vitest/*` family (`prefer-to-be`, `consistent-test-it`, …)             |
| Import cycles, ordering                       | `import-x/no-cycle`, `import-x/order`                                   |

### Convention-only (caught in code review)

- Required > optional props/args
- Discriminated unions instead of optional fields
- Single object arg
- `as const satisfies` for typed constants
- Template literal types over wide `string`
- Immutability via `Readonly` / `ReadonlyArray`
- `null` vs `undefined` semantics
- Code collocation by feature
- Container vs UI vs design-system split
- "Don't seed state from props" — prefix with `initial` if you must
- Acronyms as words (`Url`, not `URL`)

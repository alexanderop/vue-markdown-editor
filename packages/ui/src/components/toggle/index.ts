import type {
  ToggleEmits,
  ToggleGroupItemProps,
  ToggleGroupRootEmits,
  ToggleGroupRootProps,
  ToggleProps,
} from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import type { BaseToggleVariants } from './variants'

export { default as BaseToggle } from './BaseToggle.vue'
export { default as BaseToggleGroupItem } from './BaseToggleGroupItem.vue'
export { default as BaseToggleGroupRoot } from './BaseToggleGroupRoot.vue'
export {
  BASE_TOGGLE_GROUP_CONTEXT,
  type BaseToggleGroupContext,
  injectBaseToggleGroupContext,
} from './context'
export { type BaseToggleVariants, baseToggleVariantConfig, baseToggleVariants } from './variants'

// Re-declared (instead of `export type` from .vue files) because the local
// `*.vue` shim only describes a default export — see `src/vue-shim.d.ts`.
// Mirrors the workaround used by `components/tooltip/index.ts`.
export type BaseToggleProps = ToggleProps & {
  class?: HTMLAttributes['class']
  variant?: BaseToggleVariants['variant']
  size?: BaseToggleVariants['size']
}
export type BaseToggleEmits = ToggleEmits

export type BaseToggleGroupRootProps = ToggleGroupRootProps & {
  class?: HTMLAttributes['class']
  variant?: BaseToggleVariants['variant']
  size?: BaseToggleVariants['size']
  spacing?: 0 | 1
}
export type BaseToggleGroupRootEmits = ToggleGroupRootEmits

export type BaseToggleGroupItemProps = ToggleGroupItemProps & {
  class?: HTMLAttributes['class']
  variant?: BaseToggleVariants['variant']
  size?: BaseToggleVariants['size']
}

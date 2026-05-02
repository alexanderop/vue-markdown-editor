import type { HTMLAttributes } from 'vue'
import type {
  ToolbarButtonProps,
  ToolbarLinkProps,
  ToolbarRootProps,
  ToolbarSeparatorProps,
  ToolbarToggleGroupEmits,
  ToolbarToggleGroupProps,
  ToolbarToggleItemProps,
} from 'reka-ui'

import type { BaseToggleVariants } from '../toggle/variants'

export { default as BaseToolbarRoot } from './BaseToolbarRoot.vue'
export { default as BaseToolbarButton } from './BaseToolbarButton.vue'
export { default as BaseToolbarLink } from './BaseToolbarLink.vue'
export { default as BaseToolbarSeparator } from './BaseToolbarSeparator.vue'
export { default as BaseToolbarToggleGroup } from './BaseToolbarToggleGroup.vue'
export { default as BaseToolbarToggleItem } from './BaseToolbarToggleItem.vue'

export type BaseToolbarRootProps = ToolbarRootProps & {
  class?: HTMLAttributes['class']
}
export type BaseToolbarButtonProps = ToolbarButtonProps & {
  class?: HTMLAttributes['class']
}
export type BaseToolbarLinkProps = ToolbarLinkProps & {
  class?: HTMLAttributes['class']
}
export type BaseToolbarSeparatorProps = ToolbarSeparatorProps & {
  class?: HTMLAttributes['class']
}
export type BaseToolbarToggleGroupProps = ToolbarToggleGroupProps & {
  class?: HTMLAttributes['class']
}
export type BaseToolbarToggleGroupEmits = ToolbarToggleGroupEmits
export type BaseToolbarToggleItemProps = ToolbarToggleItemProps & {
  class?: HTMLAttributes['class']
  variant?: BaseToggleVariants['variant']
  size?: BaseToggleVariants['size']
}

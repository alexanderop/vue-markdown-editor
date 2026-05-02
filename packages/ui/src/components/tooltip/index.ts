import type { HTMLAttributes } from 'vue'
import type {
  TooltipArrowProps,
  TooltipContentEmits,
  TooltipContentProps,
  TooltipPortalProps,
  TooltipProviderProps,
  TooltipRootEmits,
  TooltipRootProps,
  TooltipTriggerProps,
} from 'reka-ui'

export { default as BaseTooltipProvider } from './BaseTooltipProvider.vue'
export { default as BaseTooltipRoot } from './BaseTooltipRoot.vue'
export { default as BaseTooltipTrigger } from './BaseTooltipTrigger.vue'
export { default as BaseTooltipPortal } from './BaseTooltipPortal.vue'
export { default as BaseTooltipContent } from './BaseTooltipContent.vue'
export { default as BaseTooltipArrow } from './BaseTooltipArrow.vue'

export type BaseTooltipProviderProps = TooltipProviderProps
export type BaseTooltipRootProps = TooltipRootProps
export type BaseTooltipRootEmits = TooltipRootEmits
export type BaseTooltipTriggerProps = TooltipTriggerProps
export type BaseTooltipPortalProps = TooltipPortalProps
export type BaseTooltipContentProps = TooltipContentProps & {
  class?: HTMLAttributes['class']
}
export type BaseTooltipContentEmits = TooltipContentEmits
export type BaseTooltipArrowProps = TooltipArrowProps & {
  class?: HTMLAttributes['class']
}

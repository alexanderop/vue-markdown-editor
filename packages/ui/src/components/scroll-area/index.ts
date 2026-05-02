import type { HTMLAttributes } from 'vue'
import type {
  ScrollAreaCornerProps,
  ScrollAreaRootProps,
  ScrollAreaScrollbarProps,
  ScrollAreaThumbProps,
  ScrollAreaViewportProps,
} from 'reka-ui'

export { default as BaseScrollArea } from './BaseScrollArea.vue'
export { default as BaseScrollAreaRoot } from './BaseScrollAreaRoot.vue'
export { default as BaseScrollAreaViewport } from './BaseScrollAreaViewport.vue'
export { default as BaseScrollAreaScrollbar } from './BaseScrollAreaScrollbar.vue'
export { default as BaseScrollAreaThumb } from './BaseScrollAreaThumb.vue'
export { default as BaseScrollAreaCorner } from './BaseScrollAreaCorner.vue'

export type BaseScrollAreaProps = ScrollAreaRootProps & {
  class?: HTMLAttributes['class']
  viewportClass?: HTMLAttributes['class']
}
export type BaseScrollAreaRootProps = ScrollAreaRootProps & {
  class?: HTMLAttributes['class']
}
export type BaseScrollAreaViewportProps = ScrollAreaViewportProps & {
  class?: HTMLAttributes['class']
}
export type BaseScrollAreaScrollbarProps = ScrollAreaScrollbarProps & {
  class?: HTMLAttributes['class']
}
export type BaseScrollAreaThumbProps = ScrollAreaThumbProps & {
  class?: HTMLAttributes['class']
}
export type BaseScrollAreaCornerProps = ScrollAreaCornerProps & {
  class?: HTMLAttributes['class']
}

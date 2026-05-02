<script lang="ts">
import type { HTMLAttributes } from 'vue'
import { ScrollAreaScrollbar, type ScrollAreaScrollbarProps, useForwardProps } from 'reka-ui'

export type BaseScrollAreaScrollbarProps = ScrollAreaScrollbarProps & {
  class?: HTMLAttributes['class']
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

import { cn } from '../../lib/utils'

const props = withDefaults(defineProps<BaseScrollAreaScrollbarProps>(), {
  orientation: 'vertical',
})

const delegated = computed(() => {
  const { class: _class, ...rest } = props
  return rest
})
const forwarded = useForwardProps(delegated)
</script>

<template>
  <ScrollAreaScrollbar
    v-bind="forwarded"
    data-slot="base-scroll-area-scrollbar"
    :class="
      cn(
        'flex touch-none select-none transition-colors data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5 data-[orientation=vertical]:border-l data-[orientation=vertical]:border-l-transparent data-[orientation=vertical]:p-px data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:border-t data-[orientation=horizontal]:border-t-transparent data-[orientation=horizontal]:p-px',
        props.class,
      )
    "
  >
    <slot />
  </ScrollAreaScrollbar>
</template>

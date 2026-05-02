<script lang="ts">
import type { HTMLAttributes } from 'vue'
import { ScrollAreaViewport, type ScrollAreaViewportProps, useForwardProps } from 'reka-ui'

export type BaseScrollAreaViewportProps = ScrollAreaViewportProps & {
  class?: HTMLAttributes['class']
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

import { cn } from '../../lib/utils'

const props = defineProps<BaseScrollAreaViewportProps>()

const delegated = computed(() => {
  const { class: _class, ...rest } = props
  return rest
})
const forwarded = useForwardProps(delegated)
</script>

<template>
  <ScrollAreaViewport
    v-bind="forwarded"
    data-slot="base-scroll-area-viewport"
    :class="
      cn(
        'size-full rounded-[inherit] outline-ring/50 transition-[color,box-shadow] focus-visible:outline-1 focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        props.class,
      )
    "
  >
    <slot />
  </ScrollAreaViewport>
</template>

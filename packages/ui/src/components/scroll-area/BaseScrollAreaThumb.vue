<script lang="ts">
import type { HTMLAttributes } from 'vue'
import { ScrollAreaThumb, type ScrollAreaThumbProps, useForwardProps } from 'reka-ui'

export type BaseScrollAreaThumbProps = ScrollAreaThumbProps & {
  class?: HTMLAttributes['class']
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

import { cn } from '../../lib/utils'

const props = defineProps<BaseScrollAreaThumbProps>()

const delegated = computed(() => {
  const { class: _class, ...rest } = props
  return rest
})
const forwarded = useForwardProps(delegated)
</script>

<template>
  <ScrollAreaThumb
    v-bind="forwarded"
    data-slot="base-scroll-area-thumb"
    :class="
      cn(
        'relative flex-1 rounded-full bg-border hover:bg-border-strong transition-colors',
        props.class,
      )
    "
  >
    <slot />
  </ScrollAreaThumb>
</template>

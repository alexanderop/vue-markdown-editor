<script lang="ts">
import type { HTMLAttributes } from 'vue'
import { ScrollAreaCorner, type ScrollAreaCornerProps, useForwardProps } from 'reka-ui'

export type BaseScrollAreaCornerProps = ScrollAreaCornerProps & {
  class?: HTMLAttributes['class']
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

import { cn } from '../../lib/utils'

const props = defineProps<BaseScrollAreaCornerProps>()

const delegated = computed(() => {
  const { class: _class, ...rest } = props
  return rest
})
const forwarded = useForwardProps(delegated)
</script>

<template>
  <ScrollAreaCorner v-bind="forwarded" data-slot="base-scroll-area-corner" :class="cn(props.class)">
    <slot />
  </ScrollAreaCorner>
</template>

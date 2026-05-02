<script lang="ts">
import type { HTMLAttributes } from 'vue'
import { ScrollAreaRoot, type ScrollAreaRootProps, useForwardProps } from 'reka-ui'

export type BaseScrollAreaRootProps = ScrollAreaRootProps & {
  class?: HTMLAttributes['class']
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

import { cn } from '../../lib/utils'

const props = defineProps<BaseScrollAreaRootProps>()

const delegated = computed(() => {
  const { class: _class, ...rest } = props
  return rest
})
const forwarded = useForwardProps(delegated)
</script>

<template>
  <ScrollAreaRoot
    v-bind="forwarded"
    data-slot="base-scroll-area"
    :class="cn('relative overflow-hidden', props.class)"
  >
    <slot />
  </ScrollAreaRoot>
</template>

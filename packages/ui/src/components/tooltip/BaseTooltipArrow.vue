<script lang="ts">
import type { HTMLAttributes } from 'vue'
import { TooltipArrow, type TooltipArrowProps } from 'reka-ui'

export type BaseTooltipArrowProps = TooltipArrowProps & {
  class?: HTMLAttributes['class']
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

import { cn } from '../../lib/utils'

const props = defineProps<BaseTooltipArrowProps>()

const delegated = computed(() => {
  const { class: _class, ...rest } = props
  return rest
})
</script>

<template>
  <TooltipArrow
    v-bind="delegated"
    data-slot="base-tooltip-arrow"
    :class="cn('fill-foreground', props.class)"
  />
</template>

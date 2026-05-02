<script lang="ts">
import {
  TooltipRoot,
  type TooltipRootEmits,
  type TooltipRootProps,
  useForwardPropsEmits,
} from 'reka-ui'

export type BaseTooltipRootProps = TooltipRootProps
export type BaseTooltipRootEmits = TooltipRootEmits
</script>

<script setup lang="ts">
const props = defineProps<BaseTooltipRootProps>()
const emits = defineEmits<BaseTooltipRootEmits>()
const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <TooltipRoot v-bind="forwarded">
    <slot />
  </TooltipRoot>
</template>

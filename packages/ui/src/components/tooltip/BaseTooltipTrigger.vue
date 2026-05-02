<script lang="ts">
import { TooltipTrigger, type TooltipTriggerProps } from 'reka-ui'

export type BaseTooltipTriggerProps = TooltipTriggerProps
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<BaseTooltipTriggerProps>(), {
  asChild: false,
})
</script>

<template>
  <TooltipTrigger v-bind="props" data-slot="base-tooltip-trigger">
    <slot />
  </TooltipTrigger>
</template>

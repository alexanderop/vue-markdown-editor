<script lang="ts">
import { TooltipProvider, type TooltipProviderProps, useForwardProps } from 'reka-ui'

export type BaseTooltipProviderProps = TooltipProviderProps
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<BaseTooltipProviderProps>(), {
  delayDuration: 0,
})

const forwarded = useForwardProps(props)
</script>

<template>
  <TooltipProvider v-bind="forwarded">
    <slot />
  </TooltipProvider>
</template>

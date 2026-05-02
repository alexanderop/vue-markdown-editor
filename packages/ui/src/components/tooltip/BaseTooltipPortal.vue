<script lang="ts">
import { TooltipPortal, type TooltipPortalProps } from 'reka-ui'

export type BaseTooltipPortalProps = TooltipPortalProps
</script>

<script setup lang="ts">
const props = defineProps<BaseTooltipPortalProps>()
</script>

<template>
  <TooltipPortal v-bind="props">
    <slot />
  </TooltipPortal>
</template>

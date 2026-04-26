<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { cn } from '../../lib/utils'

const props = defineProps<{
  for?: string
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <label
    :for="props.for"
    data-slot="base-label"
    :class="
      cn(
        'flex items-center gap-2 text-sm leading-none text-foreground select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        props.class,
      )
    "
  >
    <slot />
  </label>
</template>

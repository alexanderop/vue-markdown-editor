<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { cn } from '../../lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div
    data-slot="base-card"
    :class="
      cn(
        'flex flex-col gap-4 rounded-xl border border-border bg-card text-foreground shadow-xs',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>

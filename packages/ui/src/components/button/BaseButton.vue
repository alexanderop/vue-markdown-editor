<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { cn } from '../../lib/utils'

import { type BaseButtonVariants, baseButtonVariants } from './variants'

type Props = {
  variant?: BaseButtonVariants['variant']
  size?: BaseButtonVariants['size']
  class?: HTMLAttributes['class']
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'button',
})
</script>

<template>
  <button
    data-slot="base-button"
    :data-variant="variant"
    :data-size="size"
    :type="type"
    :disabled="disabled"
    :class="cn(baseButtonVariants({ variant, size }), $props.class)"
  >
    <slot />
  </button>
</template>

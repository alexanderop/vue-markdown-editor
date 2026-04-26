<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'

import { cn } from '../../lib/utils'

import { type BaseButtonVariants, baseButtonVariants } from './variants'

// `'default'` is a deprecated alias for `'md'`. Kept for one release so
// existing callers don't break — see brain/principles/migrate-callers-then-delete-legacy-apis.
type DeprecatedSizeAlias = 'default'
type Props = {
  variant?: BaseButtonVariants['variant']
  size?: BaseButtonVariants['size'] | DeprecatedSizeAlias
  class?: HTMLAttributes['class']
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
})

const resolvedSize = computed<BaseButtonVariants['size'] | undefined>(() =>
  props.size === 'default' ? 'md' : props.size,
)
</script>

<template>
  <button
    data-slot="base-button"
    :data-variant="variant"
    :data-size="resolvedSize"
    :type="type"
    :disabled="disabled"
    :class="cn(baseButtonVariants({ variant, size: resolvedSize }), $props.class)"
  >
    <slot />
  </button>
</template>

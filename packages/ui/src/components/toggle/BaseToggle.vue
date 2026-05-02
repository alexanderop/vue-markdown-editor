<script setup lang="ts">
import { Toggle, type ToggleEmits, type ToggleProps, useForwardPropsEmits } from 'reka-ui'
import { type HTMLAttributes, computed } from 'vue'

import { cn } from '../../lib/utils'

import { type BaseToggleVariants, baseToggleVariants } from './variants'

type Props = ToggleProps & {
  class?: HTMLAttributes['class']
  variant?: BaseToggleVariants['variant']
  size?: BaseToggleVariants['size']
}

const props = defineProps<Props>()
const emits = defineEmits<ToggleEmits>()

// Strip wrapper-only props before forwarding so reka's `Toggle` doesn't
// receive a stray `class`/`variant`/`size` (the latter would clobber its
// native button `size` attribute).
const delegated = computed(() => {
  const { class: _class, variant: _variant, size: _size, ...rest } = props
  return rest
})

const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <Toggle
    v-bind="forwarded"
    data-slot="base-toggle"
    :class="cn(baseToggleVariants({ variant, size }), props.class)"
  >
    <slot />
  </Toggle>
</template>

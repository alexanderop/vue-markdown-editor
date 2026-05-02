<script setup lang="ts">
import {
  ToggleGroupRoot,
  type ToggleGroupRootEmits,
  type ToggleGroupRootProps,
  useForwardPropsEmits,
} from 'reka-ui'
import { type HTMLAttributes, computed, provide } from 'vue'

import { cn } from '../../lib/utils'

import { BASE_TOGGLE_GROUP_CONTEXT } from './context'
import { type BaseToggleVariants } from './variants'

type Props = ToggleGroupRootProps & {
  class?: HTMLAttributes['class']
  variant?: BaseToggleVariants['variant']
  size?: BaseToggleVariants['size']
  spacing?: 0 | 1
}

const props = withDefaults(defineProps<Props>(), {
  spacing: 1,
})
const emits = defineEmits<ToggleGroupRootEmits>()

const delegated = computed(() => {
  const { class: _class, variant: _variant, size: _size, spacing: _spacing, ...rest } = props
  return rest
})

const forwarded = useForwardPropsEmits(delegated, emits)

provide(BASE_TOGGLE_GROUP_CONTEXT, {
  get variant() {
    return props.variant
  },
  get size() {
    return props.size
  },
  get spacing() {
    return props.spacing
  },
})
</script>

<template>
  <ToggleGroupRoot
    v-bind="forwarded"
    data-slot="base-toggle-group"
    :data-spacing="props.spacing"
    :class="cn('inline-flex items-center gap-1 data-[spacing=0]:gap-0', props.class)"
  >
    <slot />
  </ToggleGroupRoot>
</template>

<script lang="ts">
import type { HTMLAttributes } from 'vue'
import { ToolbarToggleItem, type ToolbarToggleItemProps, useForwardProps } from 'reka-ui'

import { type BaseToggleVariants } from '../toggle/variants'

export type BaseToolbarToggleItemProps = ToolbarToggleItemProps & {
  class?: HTMLAttributes['class']
  variant?: BaseToggleVariants['variant']
  size?: BaseToggleVariants['size']
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

import { cn } from '../../lib/utils'
import { baseToggleVariants } from '../toggle/variants'

const props = withDefaults(defineProps<BaseToolbarToggleItemProps>(), {
  size: 'icon',
})

const delegated = computed(() => {
  const { class: _class, variant: _variant, size: _size, ...rest } = props
  return rest
})
const forwarded = useForwardProps(delegated)
</script>

<template>
  <ToolbarToggleItem
    v-bind="forwarded"
    data-slot="base-toolbar-toggle-item"
    :class="cn(baseToggleVariants({ variant: props.variant, size: props.size }), props.class)"
  >
    <slot />
  </ToolbarToggleItem>
</template>

<script setup lang="ts">
import { ToggleGroupItem, type ToggleGroupItemProps, useForwardProps } from 'reka-ui'
import { type HTMLAttributes, computed } from 'vue'

import { cn } from '../../lib/utils'

import { injectBaseToggleGroupContext } from './context'
import { type BaseToggleVariants, baseToggleVariants } from './variants'

type Props = ToggleGroupItemProps & {
  class?: HTMLAttributes['class']
  variant?: BaseToggleVariants['variant']
  size?: BaseToggleVariants['size']
}

const props = defineProps<Props>()

// Inherit variant/size from the group; per-item props win when set.
const groupContext = injectBaseToggleGroupContext()
const resolvedVariant = computed(() => props.variant ?? groupContext.variant)
const resolvedSize = computed(() => props.size ?? groupContext.size)
const resolvedSpacing = computed(() => groupContext.spacing)

const delegated = computed(() => {
  const { class: _class, variant: _variant, size: _size, ...rest } = props
  return rest
})

const forwarded = useForwardProps(delegated)
</script>

<template>
  <ToggleGroupItem
    v-bind="forwarded"
    data-slot="base-toggle-group-item"
    :data-spacing="resolvedSpacing"
    :class="
      cn(
        baseToggleVariants({ variant: resolvedVariant, size: resolvedSize }),
        'focus:z-10 focus-visible:z-10 data-[spacing=0]:rounded-none data-[spacing=0]:shadow-none data-[spacing=0]:first:rounded-l-md data-[spacing=0]:last:rounded-r-md data-[spacing=0]:border data-[spacing=0]:border-border data-[spacing=0]:[&:not(:first-child)]:border-l-0',
        props.class,
      )
    "
  >
    <slot />
  </ToggleGroupItem>
</template>

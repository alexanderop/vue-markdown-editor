<script lang="ts">
import type { HTMLAttributes } from 'vue'
import { ToolbarButton, type ToolbarButtonProps, useForwardProps } from 'reka-ui'

export type BaseToolbarButtonProps = ToolbarButtonProps & {
  class?: HTMLAttributes['class']
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

import { cn } from '../../lib/utils'

const props = defineProps<BaseToolbarButtonProps>()

const delegated = computed(() => {
  const { class: _class, ...rest } = props
  return rest
})
const forwarded = useForwardProps(delegated)
</script>

<template>
  <ToolbarButton
    v-bind="forwarded"
    data-slot="base-toolbar-button"
    :class="
      cn(
        `inline-flex size-7 items-center justify-center rounded-md text-foreground transition-[background-color] duration-fast ease-out hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-1 disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4`,
        props.class,
      )
    "
  >
    <slot />
  </ToolbarButton>
</template>

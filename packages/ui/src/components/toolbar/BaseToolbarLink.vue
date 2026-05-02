<script lang="ts">
import type { HTMLAttributes } from 'vue'
import { ToolbarLink, type ToolbarLinkProps, useForwardProps } from 'reka-ui'

export type BaseToolbarLinkProps = ToolbarLinkProps & {
  class?: HTMLAttributes['class']
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

import { cn } from '../../lib/utils'

const props = defineProps<BaseToolbarLinkProps>()

const delegated = computed(() => {
  const { class: _class, ...rest } = props
  return rest
})
const forwarded = useForwardProps(delegated)
</script>

<template>
  <ToolbarLink
    v-bind="forwarded"
    data-slot="base-toolbar-link"
    :class="
      cn(
        `inline-flex size-7 items-center justify-center rounded-md text-foreground no-underline transition-[background-color] duration-fast ease-out hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-1 [&_svg:not([class*='size-'])]:size-4`,
        props.class,
      )
    "
  >
    <slot />
  </ToolbarLink>
</template>

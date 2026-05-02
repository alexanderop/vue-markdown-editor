<script lang="ts">
import type { HTMLAttributes } from 'vue'
import { ToolbarRoot, type ToolbarRootProps, useForwardProps } from 'reka-ui'

export type BaseToolbarRootProps = ToolbarRootProps & {
  class?: HTMLAttributes['class']
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

import { cn } from '../../lib/utils'

const props = defineProps<BaseToolbarRootProps>()

const delegated = computed(() => {
  const { class: _class, ...rest } = props
  return rest
})
const forwarded = useForwardProps(delegated)
</script>

<template>
  <ToolbarRoot
    v-bind="forwarded"
    data-slot="base-toolbar"
    :class="
      cn(
        'inline-flex items-center gap-1 rounded-lg border border-border bg-background p-1',
        props.class,
      )
    "
  >
    <slot />
  </ToolbarRoot>
</template>

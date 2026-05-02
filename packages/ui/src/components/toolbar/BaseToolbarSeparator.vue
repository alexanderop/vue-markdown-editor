<script lang="ts">
import type { HTMLAttributes } from 'vue'
import { ToolbarSeparator, type ToolbarSeparatorProps, useForwardProps } from 'reka-ui'

export type BaseToolbarSeparatorProps = ToolbarSeparatorProps & {
  class?: HTMLAttributes['class']
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

import { cn } from '../../lib/utils'

const props = defineProps<BaseToolbarSeparatorProps>()

const delegated = computed(() => {
  const { class: _class, ...rest } = props
  return rest
})
const forwarded = useForwardProps(delegated)
</script>

<template>
  <ToolbarSeparator
    v-bind="forwarded"
    data-slot="base-toolbar-separator"
    :class="cn('mx-0.5 h-4 w-px shrink-0 bg-border', props.class)"
  />
</template>

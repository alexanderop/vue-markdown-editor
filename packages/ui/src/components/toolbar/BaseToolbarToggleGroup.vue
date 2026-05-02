<script lang="ts">
import type { HTMLAttributes } from 'vue'
import {
  ToolbarToggleGroup,
  type ToolbarToggleGroupEmits,
  type ToolbarToggleGroupProps,
  useForwardPropsEmits,
} from 'reka-ui'

export type BaseToolbarToggleGroupProps = ToolbarToggleGroupProps & {
  class?: HTMLAttributes['class']
}
export type BaseToolbarToggleGroupEmits = ToolbarToggleGroupEmits
</script>

<script setup lang="ts">
import { computed } from 'vue'

import { cn } from '../../lib/utils'

const props = defineProps<BaseToolbarToggleGroupProps>()
const emits = defineEmits<BaseToolbarToggleGroupEmits>()

const delegated = computed(() => {
  const { class: _class, ...rest } = props
  return rest
})
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <ToolbarToggleGroup
    v-bind="forwarded"
    data-slot="base-toolbar-toggle-group"
    :class="cn('flex items-center gap-0.5', props.class)"
  >
    <slot />
  </ToolbarToggleGroup>
</template>

<script lang="ts">
import type { HTMLAttributes } from 'vue'
import {
  TooltipContent,
  type TooltipContentEmits,
  type TooltipContentProps,
  useForwardPropsEmits,
} from 'reka-ui'

export type BaseTooltipContentProps = TooltipContentProps & {
  class?: HTMLAttributes['class']
}
export type BaseTooltipContentEmits = TooltipContentEmits
</script>

<script setup lang="ts">
import { computed } from 'vue'

import { cn } from '../../lib/utils'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<BaseTooltipContentProps>(), {
  sideOffset: 4,
})
const emits = defineEmits<BaseTooltipContentEmits>()

const delegated = computed(() => {
  const { class: _class, ...rest } = props
  return rest
})
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <TooltipContent
    v-bind="{ ...forwarded, ...$attrs }"
    data-slot="base-tooltip-content"
    :class="
      cn(
        'z-50 overflow-hidden rounded-md bg-foreground px-2 py-1 text-xs text-background shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 text-balance',
        props.class,
      )
    "
  >
    <slot />
  </TooltipContent>
</template>

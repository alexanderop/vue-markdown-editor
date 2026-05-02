<script lang="ts">
import type { HTMLAttributes } from 'vue'
import type { ScrollAreaRootProps } from 'reka-ui'

export type BaseScrollAreaProps = ScrollAreaRootProps & {
  class?: HTMLAttributes['class']
  viewportClass?: HTMLAttributes['class']
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

import BaseScrollAreaCorner from './BaseScrollAreaCorner.vue'
import BaseScrollAreaRoot from './BaseScrollAreaRoot.vue'
import BaseScrollAreaScrollbar from './BaseScrollAreaScrollbar.vue'
import BaseScrollAreaThumb from './BaseScrollAreaThumb.vue'
import BaseScrollAreaViewport from './BaseScrollAreaViewport.vue'

const props = defineProps<BaseScrollAreaProps>()

const rootProps = computed(() => {
  const { class: _class, viewportClass: _viewportClass, ...rest } = props
  return rest
})
</script>

<template>
  <BaseScrollAreaRoot v-bind="rootProps" :class="props.class">
    <BaseScrollAreaViewport :class="props.viewportClass">
      <slot />
    </BaseScrollAreaViewport>
    <BaseScrollAreaScrollbar orientation="vertical">
      <BaseScrollAreaThumb />
    </BaseScrollAreaScrollbar>
    <BaseScrollAreaCorner />
  </BaseScrollAreaRoot>
</template>

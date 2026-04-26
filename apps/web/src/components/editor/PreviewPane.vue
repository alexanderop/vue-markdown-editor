<script setup lang="ts">
import type { ComarkTree } from 'comark'

import { EditorRenderer } from '@/shared/comark'

type PreviewPaneProps = {
  tree: ComarkTree
  streaming: boolean
}

const { tree, streaming } = defineProps<PreviewPaneProps>()
</script>

<template>
  <section class="preview-pane" tabindex="0" aria-label="Rendered markdown preview">
    <Suspense>
      <EditorRenderer :tree="tree" :streaming="streaming" />
    </Suspense>
  </section>
</template>

<style scoped>
.preview-pane {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>

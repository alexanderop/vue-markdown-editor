<script setup lang="ts">
import { computed } from 'vue'

import EditorPane from '@/components/editor/EditorPane.vue'
import PreviewPane from '@/components/editor/PreviewPane.vue'
import { useComarkPreview } from '@/composables/useComarkPreview'
import { usePersistedDoc } from '@/composables/usePersistedDoc'
import { useTheme } from '@/composables/useTheme'
import { darkTheme, lightTheme } from '@/lib/cmThemes'

const { doc } = usePersistedDoc()
const { tree, streaming } = useComarkPreview({ doc })
const { mode } = useTheme()

const editorTheme = computed(() => (mode.value === 'dark' ? darkTheme : lightTheme))

const handleDocUpdate = (next: string) => {
  doc.value = next
}
</script>

<template>
  <main class="editor-shell">
    <EditorPane
      class="editor-shell__source"
      :initial-doc="doc"
      :theme="editorTheme"
      @update:doc="handleDocUpdate"
    />
    <PreviewPane class="editor-shell__preview" :tree="tree" :streaming="streaming" />
  </main>
</template>

<style scoped>
.editor-shell {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100vh;
  width: 100vw;
  background-color: var(--background);
  color: var(--foreground);
}

.editor-shell__source {
  border-right: 1px solid var(--border);
}
</style>

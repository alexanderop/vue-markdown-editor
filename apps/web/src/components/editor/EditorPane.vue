<script setup lang="ts">
import { onMounted, useTemplateRef, watch } from 'vue'
import { type Extension } from '@codemirror/state'

import { useMarkdownEditor } from '@/composables/useMarkdownEditor'

type EditorPaneProps = {
  initialDoc: string
  theme?: Extension
  language?: Extension
}

const { initialDoc, theme, language } = defineProps<EditorPaneProps>()

const emit = defineEmits<{
  'update:doc': [doc: string]
}>()

const host = useTemplateRef<HTMLElement>('host')
const editor = useMarkdownEditor({
  host,
  initialDoc,
  onDoc: (doc) => emit('update:doc', doc),
})

onMounted(() => {
  if (theme) editor.setTheme(theme)
  if (language) editor.setLanguage(language)
})

watch(
  () => theme,
  (next) => {
    if (next) editor.setTheme(next)
  },
)

watch(
  () => language,
  (next) => {
    if (next) editor.setLanguage(next)
  },
)
</script>

<template>
  <div ref="host" class="editor-pane" />
</template>

<style scoped>
.editor-pane {
  width: 100%;
  height: 100%;
}

.editor-pane :deep(.cm-editor) {
  height: 100%;
}
</style>

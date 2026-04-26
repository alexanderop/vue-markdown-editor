<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import type { Extension } from '@codemirror/state'
import { vim as vimExt } from '@replit/codemirror-vim'
import { BaseButton } from '@vme/ui'
import { Moon, Sun, Terminal } from 'lucide-vue-next'

import PreviewPane from '@/components/editor/PreviewPane.vue'
import { useComarkPreview } from '@/composables/useComarkPreview'
import { useMarkdownEditor } from '@/composables/useMarkdownEditor'
import { usePersistedDoc } from '@/composables/usePersistedDoc'
import { useTheme } from '@/composables/useTheme'
import { useVim } from '@/composables/useVim'
import { darkTheme, lightTheme } from '@/lib/cmThemes'

const { doc } = usePersistedDoc()
const { tree, streaming } = useComarkPreview({ doc })
const { mode, toggleMode } = useTheme()
const { enabled: vimEnabled, toggle: toggleVim } = useVim()

const VIM_ON: Extension = vimExt({ status: true })
const VIM_OFF: Extension = []

const editorTheme = computed(() => (mode.value === 'dark' ? darkTheme : lightTheme))
const vimExtension = computed(() => (vimEnabled.value ? VIM_ON : VIM_OFF))

const host = useTemplateRef<HTMLElement>('host')
useMarkdownEditor({
  host,
  initialDoc: doc.value,
  onDoc: (next) => {
    doc.value = next
  },
  theme: editorTheme,
  vim: vimExtension,
})
</script>

<template>
  <main class="editor-shell">
    <div ref="host" class="editor-shell__source" />
    <PreviewPane class="editor-shell__preview" :tree="tree" :streaming="streaming" />
    <div class="editor-shell__toolbar">
      <BaseButton
        :variant="vimEnabled ? 'secondary' : 'ghost'"
        size="icon"
        :aria-label="`Vim mode ${vimEnabled ? 'on' : 'off'}`"
        :aria-pressed="vimEnabled"
        title="Toggle vim mode (Cmd/Ctrl+Shift+V)"
        @click="toggleVim"
      >
        <Terminal />
      </BaseButton>
      <BaseButton
        variant="ghost"
        size="icon"
        :aria-label="`Switch to ${mode === 'dark' ? 'light' : 'dark'} theme`"
        title="Toggle theme (Cmd/Ctrl+Shift+L)"
        @click="toggleMode"
      >
        <Sun v-if="mode === 'dark'" />
        <Moon v-else />
      </BaseButton>
    </div>
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
  width: 100%;
  height: 100%;
}

.editor-shell__source :deep(.cm-editor) {
  height: 100%;
}

.editor-shell__toolbar {
  position: fixed;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 4px;
  padding: 4px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background-color: var(--background);
  z-index: 10;
}
</style>

import { ref, shallowRef, watch, type Ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import type { ComarkTree } from 'comark'

import { parseEditorMarkdown } from '@/shared/comark'

export type UseComarkPreviewOptions = {
  doc: Ref<string>
  debounceMs?: number
}

export type UseComarkPreviewReturn = {
  tree: Ref<ComarkTree>
  streaming: Ref<boolean>
}

const DEFAULT_DEBOUNCE_MS = 40
const emptyTree = (): ComarkTree => ({ nodes: [], frontmatter: {}, meta: {} })

export function useComarkPreview(options: UseComarkPreviewOptions): UseComarkPreviewReturn {
  const tree = shallowRef<ComarkTree>(emptyTree())
  const streaming = ref(false)
  let lastParsedSource: string | undefined
  let parseToken = 0

  const runParse = async (source: string) => {
    if (lastParsedSource === source) {
      streaming.value = false
      return
    }
    const token = ++parseToken
    const next = await parseEditorMarkdown(source)
    if (token !== parseToken) return
    lastParsedSource = source
    tree.value = next
    streaming.value = false
  }

  const debouncedParse = useDebounceFn(
    (source: string) => runParse(source),
    options.debounceMs ?? DEFAULT_DEBOUNCE_MS,
  )

  watch(
    options.doc,
    (next) => {
      streaming.value = true
      void debouncedParse(next)
    },
    { immediate: true },
  )

  return { tree, streaming }
}

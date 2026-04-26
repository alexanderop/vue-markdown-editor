import { onBeforeUnmount, onMounted, shallowRef, type Ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { basicSetup } from 'codemirror'
import { Compartment, EditorState, type Extension } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { markdown } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'

export type UseMarkdownEditorOptions = {
  host: Readonly<Ref<HTMLElement | null | undefined>>
  initialDoc: string
  onDoc: (doc: string) => void
  onDocDebounceMs?: number
}

export type UseMarkdownEditorReturn = {
  setDoc: (next: string) => void
  setTheme: (extension: Extension) => void
  setLanguage: (extension: Extension) => void
  focus: () => void
}

const DEFAULT_DEBOUNCE_MS = 40
const defaultLanguage = markdown({ codeLanguages: languages })

export function useMarkdownEditor(options: UseMarkdownEditorOptions): UseMarkdownEditorReturn {
  const view = shallowRef<EditorView>()
  const themeCompartment = new Compartment()
  const languageCompartment = new Compartment()

  const debouncedEmit = useDebounceFn(
    (v: EditorView) => options.onDoc(v.state.doc.toString()),
    options.onDocDebounceMs ?? DEFAULT_DEBOUNCE_MS,
  )

  onMounted(() => {
    const host = options.host.value
    if (!host) return
    view.value = new EditorView({
      parent: host,
      state: EditorState.create({
        doc: options.initialDoc,
        extensions: [
          basicSetup,
          languageCompartment.of(defaultLanguage),
          themeCompartment.of([]),
          EditorView.contentAttributes.of({ 'aria-label': 'Markdown source editor' }),
          EditorView.updateListener.of((update) => {
            if (!update.docChanged) return
            debouncedEmit(update.view)
          }),
        ],
      }),
    })
  })

  onBeforeUnmount(() => {
    view.value?.destroy()
    view.value = undefined
  })

  return {
    setDoc(next) {
      const current = view.value
      if (!current) return
      if (current.state.doc.toString() === next) return
      current.dispatch({
        changes: { from: 0, to: current.state.doc.length, insert: next },
      })
    },
    setTheme(extension) {
      view.value?.dispatch({ effects: themeCompartment.reconfigure(extension) })
    },
    setLanguage(extension) {
      view.value?.dispatch({ effects: languageCompartment.reconfigure(extension) })
    },
    focus() {
      view.value?.focus()
    },
  }
}

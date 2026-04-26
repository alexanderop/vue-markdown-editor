import {
  onBeforeUnmount,
  onMounted,
  shallowRef,
  toValue,
  watch,
  type MaybeRefOrGetter,
  type Ref,
} from 'vue'
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
  theme?: MaybeRefOrGetter<Extension | undefined>
  language?: MaybeRefOrGetter<Extension | undefined>
  vim?: MaybeRefOrGetter<Extension | undefined>
}

export type UseMarkdownEditorReturn = {
  setDoc: (next: string) => void
  focus: () => void
}

const DEFAULT_DEBOUNCE_MS = 40
const defaultLanguage = markdown({ codeLanguages: languages })

export function useMarkdownEditor(options: UseMarkdownEditorOptions): UseMarkdownEditorReturn {
  const view = shallowRef<EditorView>()
  const themeCompartment = new Compartment()
  const languageCompartment = new Compartment()
  const vimCompartment = new Compartment()

  const debouncedEmit = useDebounceFn(
    (v: EditorView) => options.onDoc(v.state.doc.toString()),
    options.onDocDebounceMs ?? DEFAULT_DEBOUNCE_MS,
  )

  const reactivelyReconfigure = (
    source: MaybeRefOrGetter<Extension | undefined> | undefined,
    compartment: Compartment,
  ) => {
    watch(
      () => toValue(source),
      (next) => {
        if (!view.value || next === undefined) return
        view.value.dispatch({ effects: compartment.reconfigure(next) })
      },
    )
  }

  reactivelyReconfigure(options.theme, themeCompartment)
  reactivelyReconfigure(options.language, languageCompartment)
  reactivelyReconfigure(options.vim, vimCompartment)

  onMounted(() => {
    const host = options.host.value
    if (!host) return
    view.value = new EditorView({
      parent: host,
      state: EditorState.create({
        doc: options.initialDoc,
        extensions: [
          vimCompartment.of(toValue(options.vim) ?? []),
          basicSetup,
          languageCompartment.of(toValue(options.language) ?? defaultLanguage),
          themeCompartment.of(toValue(options.theme) ?? []),
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
    focus() {
      view.value?.focus()
    },
  }
}

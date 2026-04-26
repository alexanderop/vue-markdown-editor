import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { defineComponent, h, nextTick, ref, shallowRef, useTemplateRef, type ShallowRef } from 'vue'
import { EditorView } from '@codemirror/view'
import type { Extension } from '@codemirror/state'
import { vim } from '@replit/codemirror-vim'

import { useMarkdownEditor } from '../useMarkdownEditor'
import { expectNoA11yViolations } from '../../../tests/setup-browser'

type Harness = ReturnType<typeof useMarkdownEditor>

type ReactiveOptions = {
  theme?: ShallowRef<Extension | undefined>
  language?: ShallowRef<Extension | undefined>
  vim?: ShallowRef<Extension | undefined>
}

function mountEditor(
  initialDoc: string,
  onDoc: (doc: string) => void = vi.fn<(doc: string) => void>(),
  reactive: ReactiveOptions = {},
) {
  const handle: { current: Harness | undefined } = { current: undefined }
  const visible = ref(true)

  const Inner = defineComponent({
    setup() {
      const host = useTemplateRef<HTMLElement>('host')
      handle.current = useMarkdownEditor({
        host,
        initialDoc,
        onDoc,
        onDocDebounceMs: 10,
        theme: reactive.theme,
        language: reactive.language,
        vim: reactive.vim,
      })
      return () => h('div', { ref: 'host', 'data-testid': 'host', style: 'height: 200px;' })
    },
  })

  const Wrapper = defineComponent({
    setup() {
      return () => (visible.value ? h(Inner) : null)
    },
  })

  const ui = render(Wrapper)
  return Object.assign(ui, {
    handle,
    hostEl: () => ui.container.querySelector('[data-testid="host"]') as HTMLElement | null,
    contentEl: () => ui.container.querySelector('.cm-content') as HTMLElement,
    teardown: () => {
      visible.value = false
    },
  })
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

describe('useMarkdownEditor', () => {
  it('should render the initial doc into the editor surface', async () => {
    const editor = mountEditor('hello')
    await sleep(20)

    expect(editor.contentEl().textContent).toBe('hello')
    await expectNoA11yViolations(editor.container)
  })

  it('should emit the doc with the typed value after debounce', async () => {
    const onDoc = vi.fn<(doc: string) => void>()
    const editor = mountEditor('', onDoc)
    await sleep(20)

    editor.contentEl().focus()
    await userEvent.type(editor.contentEl(), 'abc')
    await sleep(60)

    expect(onDoc).toHaveBeenLastCalledWith('abc')
    expect(onDoc.mock.calls.every(([value]) => 'abc'.startsWith(value))).toBe(true)
  })

  it('should not emit when setDoc receives the current doc', async () => {
    const onDoc = vi.fn<(doc: string) => void>()
    const editor = mountEditor('hello', onDoc)
    await sleep(20)

    editor.handle.current?.setDoc('hello')
    await sleep(50)

    expect(onDoc).not.toHaveBeenCalled()
  })

  it('should replace the visible doc when setDoc receives a new value', async () => {
    const editor = mountEditor('old')
    await sleep(20)

    editor.handle.current?.setDoc('new')
    await sleep(20)

    expect(editor.contentEl().textContent).toBe('new')
  })

  it('should swap themes via reconfigure when the input ref changes', async () => {
    const themeA = EditorView.theme({ '&': { color: 'rgb(10, 20, 30)' } })
    const themeB = EditorView.theme({ '&': { color: 'rgb(40, 50, 60)' } })
    const themeRef = shallowRef<Extension | undefined>(themeA)
    const editor = mountEditor('hello', undefined, { theme: themeRef })
    await sleep(20)

    const before = editor.contentEl()
    themeRef.value = themeB
    await nextTick()
    await sleep(20)

    expect(editor.contentEl()).toBe(before)
    expect(editor.contentEl().textContent).toBe('hello')
  })

  it('should swap vim on/off via reconfigure when the input ref changes', async () => {
    const vimRef = shallowRef<Extension | undefined>([])
    const editor = mountEditor('hello world', undefined, { vim: vimRef })
    await sleep(20)

    const before = editor.contentEl()
    vimRef.value = vim({ status: true })
    await nextTick()
    await sleep(20)

    expect(editor.contentEl()).toBe(before)
    expect(editor.contentEl().textContent).toBe('hello world')

    vimRef.value = []
    await nextTick()
    await sleep(20)

    expect(editor.contentEl()).toBe(before)
    expect(editor.contentEl().textContent).toBe('hello world')
  })

  it('should stop emitting after the editor is torn down', async () => {
    const onDoc = vi.fn<(doc: string) => void>()
    const editor = mountEditor('hello', onDoc)
    await sleep(20)
    expect(editor.contentEl()).toBeTruthy()

    editor.teardown()
    await nextTick()
    onDoc.mockClear()
    await sleep(50)

    expect(editor.contentEl()).toBeNull()
    expect(onDoc).not.toHaveBeenCalled()
  })
})

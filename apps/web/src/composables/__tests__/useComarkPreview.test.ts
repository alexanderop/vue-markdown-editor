import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { render } from '@testing-library/vue'

import { useComarkPreview } from '../useComarkPreview'

import * as comarkShared from '@/shared/comark'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

type Harness = ReturnType<typeof useComarkPreview>

function mountPreview(initial: string, debounceMs = 10) {
  const doc = ref(initial)
  const handle: { current: Harness | undefined } = { current: undefined }
  const Wrapper = defineComponent({
    setup() {
      handle.current = useComarkPreview({ doc, debounceMs })
      return () => h('div')
    },
  })
  const ui = render(Wrapper)
  return { doc, handle, ui }
}

const findHeading = (tree: { nodes: Array<unknown> }) =>
  tree.nodes.find(
    (node): node is [string, Record<string, unknown>, string] =>
      Array.isArray(node) && node[0] === 'h1',
  )

describe('useComarkPreview', () => {
  it('should expose a parsed tree once the debounce settles', async () => {
    const preview = mountPreview('# h1')
    await sleep(50)

    expect(findHeading(preview.handle.current?.tree.value ?? { nodes: [] })?.[2]).toBe('h1')
  })

  it('should flip streaming true on doc change and false after parse', async () => {
    const preview = mountPreview('start')
    await sleep(50)
    expect(preview.handle.current?.streaming.value).toBe(false)

    preview.doc.value = 'next'
    await nextTick()
    expect(preview.handle.current?.streaming.value).toBe(true)

    await sleep(50)
    expect(preview.handle.current?.streaming.value).toBe(false)
  })

  it('should coalesce a burst of edits into one parse', async () => {
    const spy = vi.spyOn(comarkShared, 'parseEditorMarkdown')
    const preview = mountPreview('initial')
    await sleep(50)
    spy.mockClear()

    preview.doc.value = 'a'
    preview.doc.value = 'ab'
    preview.doc.value = 'abc'
    await sleep(80)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenLastCalledWith('abc')
    spy.mockRestore()
  })

  it('should not re-parse when the doc is reassigned to its current value', async () => {
    const spy = vi.spyOn(comarkShared, 'parseEditorMarkdown')
    const preview = mountPreview('same')
    await sleep(50)
    spy.mockClear()

    preview.doc.value = 'same'
    await sleep(80)

    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })
})

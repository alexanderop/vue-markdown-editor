import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'

import EditorPane from '../EditorPane.vue'
import { expectNoA11yViolations } from '../../../../tests/setup-browser'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const contentEl = (container: Element) => container.querySelector('.cm-content') as HTMLElement

describe('EditorPane', () => {
  it('should render the initial doc through the underlying editor', async () => {
    const { container } = render(EditorPane, { props: { initialDoc: 'hello' } })
    await sleep(40)

    expect(contentEl(container).textContent).toBe('hello')
    await expectNoA11yViolations(container)
  })

  it('should emit update:doc when the user types', async () => {
    const onUpdate = vi.fn<(doc: string) => void>()
    const { container } = render(EditorPane, {
      props: { initialDoc: '' },
      attrs: { 'onUpdate:doc': onUpdate },
    })
    await sleep(40)

    contentEl(container).focus()
    await userEvent.type(contentEl(container), 'abc')
    await sleep(80)

    expect(onUpdate).toHaveBeenCalledWith('abc')
  })

  it('should not rebuild the editor surface when the initialDoc prop changes', async () => {
    const { container, rerender } = render(EditorPane, { props: { initialDoc: 'first' } })
    await sleep(40)
    const before = contentEl(container)

    await rerender({ initialDoc: 'unrelated' })
    await sleep(40)

    expect(contentEl(container)).toBe(before)
  })
})

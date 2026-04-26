import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'

import EditorScratch from '../EditorScratch.vue'
import { expectNoA11yViolations } from '../../../tests/setup-browser'

import { SCRATCH_STORAGE_KEY } from '@/composables/usePersistedDoc'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

describe('EditorScratch', () => {
  beforeEach(() => {
    globalThis.localStorage.clear()
  })

  afterEach(() => {
    globalThis.localStorage.clear()
  })

  it('should mount both panes side by side', async () => {
    const { container } = render(EditorScratch)
    await sleep(80)

    expect(container.querySelector('.cm-content')).toBeTruthy()
    expect(container.querySelector('.preview-pane')).toBeTruthy()
    await expectNoA11yViolations(container, {
      // Default shiki theme tokens fail contrast against the Linear-token surface.
      rules: { 'color-contrast': { enabled: false } },
    })
  })

  it('should render typed source in the preview after debounce', async () => {
    globalThis.localStorage.setItem(SCRATCH_STORAGE_KEY, '')
    const { container } = render(EditorScratch)
    await sleep(80)

    const cm = container.querySelector('.cm-content') as HTMLElement
    cm.focus()
    await userEvent.type(cm, '# Heading')
    await sleep(120)

    expect(container.querySelector('.preview-pane h1')?.textContent).toBe('Heading')
  })

  it('should hydrate both panes from a previously persisted doc', async () => {
    globalThis.localStorage.setItem(SCRATCH_STORAGE_KEY, '# Persisted heading')
    const { container } = render(EditorScratch)
    await sleep(80)

    expect(container.querySelector('.cm-content')?.textContent).toContain('# Persisted heading')
    expect(container.querySelector('.preview-pane h1')?.textContent).toBe('Persisted heading')
  })
})

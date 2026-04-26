import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import { useVim, VIM_STORAGE_KEY } from '../useVim'

describe('useVim', () => {
  beforeEach(() => {
    globalThis.localStorage.clear()
  })

  afterEach(() => {
    globalThis.localStorage.clear()
  })

  it('should default to disabled when no value has been persisted', () => {
    const { enabled } = useVim()
    expect(enabled.value).toBe(false)
  })

  it('should flip and persist to localStorage when toggle is called', async () => {
    const { enabled, toggle } = useVim()

    toggle()
    await nextTick()

    expect(enabled.value).toBe(true)
    expect(globalThis.localStorage.getItem(VIM_STORAGE_KEY)).toBe('true')
  })

  it('should pick up the persisted value when re-instantiated', () => {
    globalThis.localStorage.setItem(VIM_STORAGE_KEY, 'true')
    const { enabled } = useVim()
    expect(enabled.value).toBe(true)
  })
})

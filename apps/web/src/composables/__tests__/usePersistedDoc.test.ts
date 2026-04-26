import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import { SCRATCH_STORAGE_KEY, WELCOME_STUB, usePersistedDoc } from '../usePersistedDoc'

describe('usePersistedDoc', () => {
  beforeEach(() => {
    globalThis.localStorage.clear()
  })

  afterEach(() => {
    globalThis.localStorage.clear()
  })

  it('should expose the welcome stub when no value has been persisted', () => {
    const { doc } = usePersistedDoc()
    expect(doc.value).toBe(WELCOME_STUB)
  })

  it('should expose a previously persisted value on first read', () => {
    globalThis.localStorage.setItem(SCRATCH_STORAGE_KEY, '# saved')
    const { doc } = usePersistedDoc()
    expect(doc.value).toBe('# saved')
  })

  it('should round-trip writes through localStorage', async () => {
    const first = usePersistedDoc()
    first.doc.value = '# new'
    await nextTick()

    const second = usePersistedDoc()
    expect(second.doc.value).toBe('# new')
  })

  it('should never re-emit the welcome stub once a value has been written', async () => {
    const first = usePersistedDoc()
    first.doc.value = '# saved'
    await nextTick()

    const second = usePersistedDoc()
    expect(second.doc.value).not.toBe(WELCOME_STUB)
  })
})

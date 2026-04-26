import { describe, expect, it } from 'vitest'

import App from '../App.vue'

import { createTestApp } from './helpers/createTestApp'

describe('App', () => {
  it('renders the @vme/ui showcase header', () => {
    const wrapper = createTestApp(App)
    expect(wrapper.text()).toContain('@vme/ui')
  })
})

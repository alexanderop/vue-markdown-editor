import { describe, expect, it } from 'vitest'
import { RouterView } from 'vue-router'

import App from '../App.vue'

import { createTestApp } from './helpers/createTestApp'

describe('App', () => {
  it('renders the router outlet so route content can mount', () => {
    const wrapper = createTestApp(App)
    expect(wrapper.findComponent(RouterView).exists()).toBeTruthy()
  })
})

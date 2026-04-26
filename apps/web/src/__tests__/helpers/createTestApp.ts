import type { Component } from 'vue'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'

interface CreateTestAppOptions {
  route?: string
  props?: Record<string, unknown>
}

export function createTestApp(component: Component, options: CreateTestAppOptions = {}) {
  const router = createRouter({ history: createMemoryHistory(), routes: [] })
  if (options.route) {
    router.push(options.route)
  }
  return mount(component, {
    props: options.props,
    global: { plugins: [router] },
  })
}

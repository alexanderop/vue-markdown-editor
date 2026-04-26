import type { Component } from 'vue'
import { render, type RenderOptions } from '@testing-library/vue'
import { expect, it } from 'vitest'

// Matrix test helper modelled on Nuxt UI's `renderEach`.
// (https://github.com/nuxt/ui/blob/main/test/component-render.ts)
//
// Pass a list of `[name, options]` cases and every case becomes an `it.each`
// row that snapshots `container.innerHTML`. Cleanup runs via the global
// `afterEach(cleanup)` registered in `setup-browser.ts`.
//
// Use sparingly: one matrix per component (variant × size) is enough. Don't
// snapshot every prop permutation — that turns into a maintenance tax that
// tests the test, not the component.
type RenderArgs = RenderOptions<Record<string, unknown>>
type Case = readonly [name: string, options: RenderArgs]

export function renderEach(component: Component, cases: ReadonlyArray<Case>) {
  it.each(cases as readonly Case[])('should render %s correctly', (_name, options) => {
    const { container } = render(component, options as RenderArgs)
    expect(container.innerHTML).toMatchSnapshot()
  })
}

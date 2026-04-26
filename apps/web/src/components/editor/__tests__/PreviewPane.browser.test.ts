import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'

import PreviewPane from '../PreviewPane.vue'
import { expectNoA11yViolations } from '../../../../tests/setup-browser'

import { parseEditorMarkdown } from '@/shared/comark'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

describe('PreviewPane', () => {
  it('should render a heading from a parsed tree', async () => {
    const tree = await parseEditorMarkdown('# Hello')
    const { container } = render(PreviewPane, { props: { tree, streaming: false } })
    await sleep(20)

    const heading = container.querySelector('h1')
    expect(heading?.textContent).toBe('Hello')
    await expectNoA11yViolations(container)
  })

  it('should render a fenced code block with shiki-styled spans', async () => {
    const tree = await parseEditorMarkdown('```ts\nconst x = 1\n```')
    const { container } = render(PreviewPane, { props: { tree, streaming: false } })
    await sleep(20)

    const pre = container.querySelector('pre')
    expect(pre).toBeTruthy()
    const styledSpans = container.querySelectorAll('pre span[style*="color"]')
    expect(styledSpans.length).toBeGreaterThan(0)
  })

  it('should render an unterminated emphasis without throwing in streaming mode', async () => {
    const tree = await parseEditorMarkdown('**bold')
    const { container } = render(PreviewPane, { props: { tree, streaming: true } })
    await sleep(20)

    expect(container.querySelector('strong')?.textContent).toBe('bold')
  })

  it('should render a richer document without a11y violations', async () => {
    const tree = await parseEditorMarkdown(
      '# Title\n\nA paragraph.\n\n- one\n- two\n\n```ts\nconst y = 2\n```',
    )
    const { container } = render(PreviewPane, { props: { tree, streaming: false } })
    await sleep(20)
    await expectNoA11yViolations(container)
  })
})

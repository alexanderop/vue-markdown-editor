import { describe, expect, it } from 'vitest'
import type { ComarkElement, ComarkTree } from 'comark'

import { parseEditorMarkdown } from '../comark'

const isElement = (node: unknown): node is ComarkElement =>
  Array.isArray(node) && typeof node[0] === 'string'

const findElement = (tree: ComarkTree, tag: string): ComarkElement | undefined => {
  const stack: Array<unknown> = [...tree.nodes]
  while (stack.length > 0) {
    const node = stack.pop()
    if (!isElement(node)) continue
    if (node[0] === tag) return node
    stack.push(...node.slice(2))
  }
  return undefined
}

describe('parseEditorMarkdown', () => {
  it('should parse a level-1 heading into an h1 element with its text', async () => {
    const tree = await parseEditorMarkdown('# h1')

    const heading = findElement(tree, 'h1')
    expect(heading).toBeDefined()
    expect(heading?.[2]).toBe('h1')
  })

  it('should auto-close an unterminated bold span without throwing', async () => {
    const tree = await parseEditorMarkdown('**bold')

    const strong = findElement(tree, 'strong')
    expect(strong).toBeDefined()
    expect(strong?.[2]).toBe('bold')
  })

  it('should preserve the language on a fenced code block (after shiki highlight)', async () => {
    const tree = await parseEditorMarkdown('```ts\nconst x = 1\n```')

    const pre = findElement(tree, 'pre')
    expect(pre).toBeDefined()
    expect(pre?.[1]?.language).toBe('ts')
  })

  it('should produce a structurally identical tree for the same source', async () => {
    const source = '# Same\n\nsame body'
    const a = await parseEditorMarkdown(source)
    const b = await parseEditorMarkdown(source)

    expect(JSON.stringify(a.nodes)).toBe(JSON.stringify(b.nodes))
  })
})

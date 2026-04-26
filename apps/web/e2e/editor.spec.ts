import type { Page } from '@playwright/test'

import { SCRATCH_STORAGE_KEY } from '../src/composables/usePersistedDoc'
import { VIM_STORAGE_KEY } from '../src/composables/useVim'

import { EditorPage } from './pages/EditorPage'
import { test, expect } from './fixtures'

const clearScratch = async (page: Page) => {
  await page.evaluate((key) => globalThis.localStorage.removeItem(key), SCRATCH_STORAGE_KEY)
}

const replaceDoc = async (page: Page, text: string) => {
  await page.locator('.cm-content').focus()
  await page.keyboard.press('ControlOrMeta+a')
  await page.keyboard.press('Delete')
  await page.keyboard.type(text)
}

test('renders both panes and turns typed source into a preview heading', async ({ page }) => {
  await page.goto('/')
  await clearScratch(page)
  await page.reload()
  await expect(page.locator('.cm-content')).toBeVisible()
  await expect(page.locator('.preview-pane')).toBeVisible()

  await replaceDoc(page, '# Hello')

  await expect(page.locator('.preview-pane h1')).toHaveText('Hello')
})

test('persists the typed doc across a page reload', async ({ page }) => {
  await page.goto('/')
  await clearScratch(page)
  await page.reload()
  await replaceDoc(page, '# Persisted note')

  await expect(async () => {
    const stored = await page.evaluate(
      (key) => globalThis.localStorage.getItem(key),
      SCRATCH_STORAGE_KEY,
    )
    expect(stored).toContain('# Persisted note')
  }).toPass()

  await page.reload()
  await expect(page.locator('.preview-pane h1')).toHaveText('Persisted note')
  await expect(page.locator('.cm-content')).toContainText('# Persisted note')
})

test('highlights fenced code blocks via shiki', async ({ page }) => {
  await page.goto('/')
  await clearScratch(page)
  await page.reload()
  await replaceDoc(page, '```ts\nconst x = 1\n```')

  const styledSpans = page.locator('.preview-pane pre span[style*="color"]')
  await expect(styledSpans.first()).toBeAttached()
})

test('toggles theme via Cmd/Ctrl+Shift+L without rebuilding the editor', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('html')).toHaveClass(/dark/)
  const cmContentBefore = await page.locator('.cm-content').elementHandle()

  await page.keyboard.press('ControlOrMeta+Shift+KeyL')

  await expect(page.locator('html')).not.toHaveClass(/dark/)
  const cmContentAfter = await page.locator('.cm-content').elementHandle()
  expect(await cmContentAfter?.evaluate((node, before) => node === before, cmContentBefore)).toBe(
    true,
  )
})

test('vim mode toggles via keyboard and exposes status bar', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(
    ([scratchKey, vimKey, body]) => {
      globalThis.localStorage.setItem(scratchKey, body)
      globalThis.localStorage.removeItem(vimKey)
    },
    [SCRATCH_STORAGE_KEY, VIM_STORAGE_KEY, 'line one\nline two\nline three\n'],
  )
  await page.reload()
  await expect(page.locator('.cm-content')).toBeVisible()

  const editor = new EditorPage(page)

  expect(await editor.vimMode()).toBeNull()

  await editor.toggleVim()
  await expect(page.locator('.cm-vim-panel')).toBeVisible()
  expect(await editor.vimMode()).toMatch(/.*/)

  const beforeLines = await editor.lineCount()
  await page.keyboard.press('Escape')
  await editor.normalCommand('dd')
  await expect.poll(() => editor.lineCount()).toBe(beforeLines - 1)

  const docAfterDelete = await page.locator('.cm-content').textContent()

  await editor.toggleVim()
  await expect(page.locator('.cm-vim-panel')).toHaveCount(0)
  await expect(page.locator('.cm-content')).toHaveText(docAfterDelete)

  const persisted = await page.evaluate(
    (key) => globalThis.localStorage.getItem(key),
    VIM_STORAGE_KEY,
  )
  expect(persisted).toBe('false')

  await page.reload()
  await expect(page.locator('.cm-content')).toBeVisible()
  expect(await editor.vimMode()).toBeNull()
})

test('logs no console errors during the typing flow', async ({ page }) => {
  const errors: Array<string> = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })

  await page.goto('/')
  await clearScratch(page)
  await page.reload()
  await replaceDoc(page, 'A quick line of text.')
  await expect(page.locator('.preview-pane')).toContainText('A quick line of text.')

  expect(errors).toEqual([])
})

import type { Page } from '@playwright/test'

export class EditorPage {
  constructor(private readonly page: Page) {}

  async toggleVim(): Promise<void> {
    await this.page.locator('.cm-content').focus()
    await this.page.keyboard.press('ControlOrMeta+Shift+KeyV')
  }

  async vimMode(): Promise<string | null> {
    const panel = this.page.locator('.cm-vim-panel')
    if ((await panel.count()) === 0) return null
    const text = await panel.first().textContent()
    return text?.trim() ?? ''
  }

  async normalCommand(seq: string): Promise<void> {
    await this.page.locator('.cm-content').focus()
    for (const ch of seq) {
      await this.page.keyboard.press(ch)
    }
  }

  async lineCount(): Promise<number> {
    return this.page.locator('.cm-content .cm-line').count()
  }
}

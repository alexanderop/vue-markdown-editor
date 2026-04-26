// @vitest-environment node
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

// Meta-test: every component test that runs in browser mode must include at
// least one a11y assertion. We grep for `expectNoA11yViolations` rather than
// statically analysing — string presence is enough to keep the practice
// honest, and the test itself fails CI if anyone bypasses it.
//
// Lives in the unit project on purpose: it reads files, doesn't need a DOM,
// and runs every CI build (browser project may be slower).
const ROOT = fileURLToPath(new URL('../', import.meta.url))
const SRC = path.join(ROOT, 'src')
const REQUIRED_HELPER = 'expectNoA11yViolations'
const BROWSER_TEST_FILE = /\.browser\.(?:test|spec)\.(?:ts|tsx)$/

async function walk(dir: string): Promise<Array<string>> {
  const entries = await readdir(dir, { withFileTypes: true })
  const out: Array<string> = []
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(...(await walk(full)))
      continue
    }
    if (entry.isFile() && BROWSER_TEST_FILE.test(entry.name)) {
      out.push(full)
    }
  }
  return out
}

describe('a11y meta-test', () => {
  it('every browser-mode component test asserts a11y', async () => {
    let files: Array<string> = []
    try {
      files = await walk(SRC)
    } catch {
      // src/ doesn't exist or is empty — nothing to enforce yet.
      return
    }

    const missing: Array<string> = []
    for (const file of files) {
      const contents = await readFile(file, 'utf8')
      if (!contents.includes(REQUIRED_HELPER)) {
        missing.push(path.relative(ROOT, file))
      }
    }

    if (missing.length > 0) {
      throw new Error(
        `Browser-mode component tests must call \`${REQUIRED_HELPER}\` at least once. Missing in:\n${missing.join('\n')}`,
      )
    }
    expect(missing).toEqual([])
  })
})

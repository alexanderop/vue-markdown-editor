import { EditorView } from '@codemirror/view'
import type { Extension } from '@codemirror/state'

const FONT_MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace"

const baseTheme = {
  '&': {
    fontFamily: FONT_MONO,
    fontSize: '13px',
    height: '100%',
  },
  '.cm-content': {
    fontFamily: FONT_MONO,
    padding: '20px 24px',
    caretColor: 'var(--accent)',
  },
  '.cm-gutters': {
    backgroundColor: 'var(--background)',
    color: 'var(--muted-foreground)',
    border: 'none',
    padding: '0 6px',
  },
  '.cm-activeLine': { backgroundColor: 'var(--accent-soft)' },
  '.cm-activeLineGutter': { backgroundColor: 'var(--accent-soft)' },
  '.cm-cursor': { borderLeftColor: 'var(--accent)' },
  '.cm-selectionBackground, ::selection': { backgroundColor: 'var(--accent-soft)' },
  '&.cm-focused .cm-selectionBackground': { backgroundColor: 'var(--accent-soft)' },
  '&.cm-focused': { outline: 'none' },
  '.cm-scroller': { lineHeight: '1.55' },
}

const surface = {
  '&': {
    backgroundColor: 'var(--background)',
    color: 'var(--foreground)',
  },
}

export const lightTheme: Extension = EditorView.theme({ ...baseTheme, ...surface }, { dark: false })

export const darkTheme: Extension = EditorView.theme({ ...baseTheme, ...surface }, { dark: true })

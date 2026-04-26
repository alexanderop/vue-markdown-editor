import { defineComarkRendererComponent } from '@comark/vue'
import highlight from '@comark/vue/plugins/highlight'
import { parse, type ComarkTree, type ParseOptions } from 'comark'

const PARSE_OPTIONS: ParseOptions = {
  autoClose: true,
  plugins: [highlight()],
}

export const EditorRenderer = defineComarkRendererComponent({
  name: 'EditorRenderer',
})

export function parseEditorMarkdown(source: string): Promise<ComarkTree> {
  return parse(source, PARSE_OPTIONS)
}

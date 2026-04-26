import type { RemovableRef } from '@vueuse/core'
import { useStorage } from '@vueuse/core'

export const SCRATCH_STORAGE_KEY = 'vme:scratch'

export const WELCOME_STUB = `# Welcome to your scratchpad

Type on the left, watch the preview on the right. Everything you write is saved
to your browser automatically — close the tab and come back to it later.

A few things you can try:

- **Bold**, _italic_, and \`inline code\`.
- Lists, like this one.
- Fenced code blocks:

\`\`\`ts
const greet = (name: string) => \`Hello, \${name}!\`
\`\`\`

Press \`Cmd\`+\`Shift\`+\`L\` to flip between light and dark.
`

export type UsePersistedDocReturn = {
  doc: RemovableRef<string>
}

export function usePersistedDoc(): UsePersistedDocReturn {
  const doc = useStorage(SCRATCH_STORAGE_KEY, WELCOME_STUB)
  return { doc }
}

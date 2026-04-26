import { useColorMode } from '@vueuse/core'

import { useToggleHotkey } from './useToggleHotkey'

export const useTheme = () => {
  const mode = useColorMode({
    selector: 'html',
    attribute: 'class',
    initialValue: 'dark',
    storageKey: 'vme-theme',
    modes: { light: '', dark: 'dark' },
  })

  const toggleMode = () => {
    mode.value = mode.value === 'dark' ? 'light' : 'dark'
  }

  useToggleHotkey('L', toggleMode)

  return { mode, toggleMode }
}

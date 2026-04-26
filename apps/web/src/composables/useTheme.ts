import { useColorMode, useMagicKeys, whenever } from '@vueuse/core'

export const useTheme = () => {
  const mode = useColorMode({
    selector: 'html',
    attribute: 'class',
    initialValue: 'dark',
    storageKey: 'vme-theme',
    modes: { light: '', dark: 'dark' },
  })

  const keys = useMagicKeys({
    passive: false,
    onEventFired(event) {
      const isToggleCombo = event.key === 'L' && (event.metaKey || event.ctrlKey) && event.shiftKey
      if (isToggleCombo) event.preventDefault()
    },
  })

  const toggleMode = () => {
    mode.value = mode.value === 'dark' ? 'light' : 'dark'
  }

  whenever(() => keys['Meta+Shift+L']?.value === true, toggleMode)
  whenever(() => keys['Ctrl+Shift+L']?.value === true, toggleMode)

  return { mode, toggleMode }
}

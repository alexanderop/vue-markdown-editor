import { useMagicKeys, whenever } from '@vueuse/core'

export const useToggleHotkey = (letter: string, toggle: () => void): void => {
  const upper = letter.toUpperCase()

  const keys = useMagicKeys({
    passive: false,
    onEventFired(event) {
      const isToggleCombo =
        event.key === upper && (event.metaKey || event.ctrlKey) && event.shiftKey
      if (isToggleCombo) event.preventDefault()
    },
  })

  whenever(() => keys[`Meta+Shift+${upper}`]?.value === true, toggle)
  whenever(() => keys[`Ctrl+Shift+${upper}`]?.value === true, toggle)
}

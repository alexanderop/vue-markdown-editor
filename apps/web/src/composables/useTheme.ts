import { useColorMode } from '@vueuse/core'

export const useTheme = () => {
  const mode = useColorMode({
    selector: 'html',
    attribute: 'class',
    initialValue: 'dark',
    storageKey: 'vme-theme',
    modes: { light: '', dark: 'dark' },
  })
  return { mode }
}

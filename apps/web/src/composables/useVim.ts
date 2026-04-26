import { useStorage } from '@vueuse/core'
import type { Ref } from 'vue'

import { useToggleHotkey } from './useToggleHotkey'

export const VIM_STORAGE_KEY = 'vme:vim'

export type UseVimReturn = {
  enabled: Ref<boolean>
  toggle: () => void
}

export const useVim = (): UseVimReturn => {
  const enabled = useStorage<boolean>(VIM_STORAGE_KEY, false)

  const toggle = () => {
    enabled.value = !enabled.value
  }

  useToggleHotkey('V', toggle)

  return { enabled, toggle }
}

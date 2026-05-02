import { type InjectionKey, inject } from 'vue'

import type { BaseToggleVariants } from './variants'

// Local context — separate from reka's own ToggleGroup root context (which
// only carries behaviour state). This one carries our visual variant + size
// so `BaseToggleGroupItem` children can inherit defaults from the group.
export type BaseToggleGroupContext = {
  variant?: BaseToggleVariants['variant']
  size?: BaseToggleVariants['size']
  spacing?: 0 | 1
}

export const BASE_TOGGLE_GROUP_CONTEXT: InjectionKey<BaseToggleGroupContext> =
  Symbol('BaseToggleGroupContext')

export function injectBaseToggleGroupContext(): BaseToggleGroupContext {
  return inject(BASE_TOGGLE_GROUP_CONTEXT, {})
}

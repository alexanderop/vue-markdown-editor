<script setup lang="ts">
import type { HTMLAttributes, InputHTMLAttributes } from 'vue'

import { cn } from '../../lib/utils'

const props = defineProps<{
  modelValue?: string | number
  class?: HTMLAttributes['class']
  type?: InputHTMLAttributes['type']
  placeholder?: string
  disabled?: boolean
  name?: string
  id?: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()
</script>

<template>
  <input
    :value="modelValue"
    :type="type ?? 'text'"
    :placeholder="placeholder"
    :disabled="disabled"
    :name="name"
    :id="id"
    data-slot="base-input"
    :class="
      cn(
        'flex h-8 w-full min-w-0 rounded-md border border-border bg-transparent px-3 text-sm text-foreground placeholder:text-muted-foreground transition-[color,background-color,border-color] duration-fast ease-out hover:border-border-strong disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-1',
        props.class,
      )
    "
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>

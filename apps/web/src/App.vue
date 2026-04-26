<script setup lang="ts">
import { ref } from 'vue'
import {
  BaseButton,
  BaseCard,
  BaseCardContent,
  BaseCardDescription,
  BaseCardFooter,
  BaseCardHeader,
  BaseCardTitle,
  BaseInput,
  BaseLabel,
} from '@vme/ui'

import { useTheme } from './composables/useTheme'

const { mode } = useTheme()
const email = ref('')

const handleThemeToggle = () => {
  mode.value = mode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <main class="min-h-screen bg-background text-foreground">
    <div class="mx-auto max-w-3xl px-6 py-10 space-y-8">
      <header class="flex items-start justify-between gap-4">
        <div class="space-y-1">
          <h1 class="text-2xl font-semibold tracking-[-0.012em]">@vme/ui</h1>
          <p class="text-sm text-muted-foreground">
            Linear-flavoured Base components — Inter Variable, accent
            <span class="text-accent">#5E6AD2</span>, 13 px body.
          </p>
        </div>
        <BaseButton variant="ghost" size="sm" @click="handleThemeToggle">
          {{ mode === 'dark' ? 'Light' : 'Dark' }}
        </BaseButton>
      </header>

      <section class="space-y-3">
        <h2 class="text-sm text-muted-foreground">Buttons</h2>
        <div class="flex flex-wrap items-center gap-2">
          <BaseButton>Primary</BaseButton>
          <BaseButton variant="secondary">Secondary</BaseButton>
          <BaseButton variant="outline">Outline</BaseButton>
          <BaseButton variant="ghost">Ghost</BaseButton>
          <BaseButton variant="link">Link</BaseButton>
          <BaseButton variant="destructive">Destructive</BaseButton>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <BaseButton size="sm">Small (24)</BaseButton>
          <BaseButton size="md">Medium (28)</BaseButton>
          <BaseButton size="lg">Large (32)</BaseButton>
          <BaseButton disabled>Disabled</BaseButton>
        </div>
      </section>

      <BaseCard class="max-w-md">
        <BaseCardHeader>
          <BaseCardTitle>Subscribe</BaseCardTitle>
          <BaseCardDescription>
            Drop your email for occasional updates on the editor.
          </BaseCardDescription>
        </BaseCardHeader>
        <BaseCardContent class="space-y-2">
          <BaseLabel for="email">Email</BaseLabel>
          <BaseInput id="email" v-model="email" type="email" placeholder="you@example.com" />
        </BaseCardContent>
        <BaseCardFooter class="justify-end gap-2">
          <BaseButton variant="ghost">Cancel</BaseButton>
          <BaseButton>Subscribe</BaseButton>
        </BaseCardFooter>
      </BaseCard>
    </div>
  </main>
</template>

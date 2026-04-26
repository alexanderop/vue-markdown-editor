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

const email = ref('')
</script>

<template>
  <main class="min-h-screen bg-background text-foreground p-10">
    <div class="mx-auto max-w-3xl space-y-10">
      <header class="space-y-2">
        <h1 class="text-3xl font-semibold tracking-tight">@vme/ui — Base components</h1>
        <p class="text-muted-foreground">
          shadcn-vue style, authored locally with the
          <code class="font-mono text-sm">Base</code> prefix.
        </p>
      </header>

      <section class="space-y-4">
        <h2 class="text-lg font-medium">Buttons</h2>
        <div class="flex flex-wrap items-center gap-3">
          <BaseButton>Default</BaseButton>
          <BaseButton variant="secondary">Secondary</BaseButton>
          <BaseButton variant="outline">Outline</BaseButton>
          <BaseButton variant="ghost">Ghost</BaseButton>
          <BaseButton variant="link">Link</BaseButton>
          <BaseButton variant="destructive">Destructive</BaseButton>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <BaseButton size="sm">Small</BaseButton>
          <BaseButton>Default</BaseButton>
          <BaseButton size="lg">Large</BaseButton>
          <BaseButton disabled>Disabled</BaseButton>
        </div>
      </section>

      <BaseCard class="max-w-md">
        <BaseCardHeader>
          <BaseCardTitle>Sign up</BaseCardTitle>
          <BaseCardDescription
            >Enter your email to subscribe to the newsletter.</BaseCardDescription
          >
        </BaseCardHeader>
        <BaseCardContent class="space-y-3">
          <div class="space-y-1.5">
            <BaseLabel for="email">Email</BaseLabel>
            <BaseInput id="email" v-model="email" type="email" placeholder="you@example.com" />
          </div>
        </BaseCardContent>
        <BaseCardFooter class="justify-end">
          <BaseButton>Subscribe</BaseButton>
        </BaseCardFooter>
      </BaseCard>
    </div>
  </main>
</template>

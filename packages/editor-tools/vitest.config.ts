import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    name: 'editor-tools',
    environment: 'node',
    include: ['src/**/__tests__/**/*.{test,spec}.ts', 'src/**/*.{test,spec}.ts'],
  },
})

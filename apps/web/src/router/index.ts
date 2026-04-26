import { createRouter, createWebHistory } from 'vue-router'

import EditorScratch from '@/pages/EditorScratch.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{ path: '/', name: 'editor', component: EditorScratch }],
})

export default router

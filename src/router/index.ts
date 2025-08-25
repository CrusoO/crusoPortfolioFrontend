/*
  Router configuration for the portfolio application
  Simple single-page application with only the main route
*/

import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../App.vue'),
    },
  ],
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/data',
      name: 'data',
      component: () => import('../views/Data.vue')
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('../views/User.vue')
    },
    {
      path: '/detail',
      name: 'detail',
      component: () => import('../views/Detail.vue')
    },
  ]
})

export default router

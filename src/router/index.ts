import { createRouter, createWebHistory } from 'vue-router'
import IndexView from '@/views/IndexView.vue'

const formatDate = (date: Date) => {
  return `/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
}

const randomDateUrl = () => {
  const start = new Date(1995, 5, 16)
  const end = new Date()
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  return formatDate(date)
}

const todayUrl = () => formatDate(new Date())

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: todayUrl
    },
    {
      path: '/:year([0-9]{4})/:month([0-9]{1,2})/:day([0-9]{1,2})',
      name: 'apod',
      component: IndexView
    },
    {
      path: '/random',
      name: 'picker',
      redirect: randomDateUrl
    },
    {
      path: '/:catchAll(.*)',
      component: import('@/views/NotFoundView.vue')
    }
  ]
})

export default router

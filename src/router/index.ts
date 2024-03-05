import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/IndexView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: new Date().toISOString().split('T')[0].replace('-', '/').replace('-', '/')
    },
    {
      path: '/:year([0-9]{4})/:month([0-9]{2})/:day([0-9]{2})',
      name: 'apod',
      component: HomeView
	  
    }
  ]
})

export default router

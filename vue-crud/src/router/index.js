import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductHome from '@/views/ProductHome.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/create',
      name: 'create',
      component: () => import('../views/CreateView.vue')
    },
    {
      path: '/update/:id',
      name: 'update',
      component: () => import('../views/UpdateView.vue')
    },
    {
      path: '/product',
      name: 'product',
      component: ProductHome
    },
    {
      path: '/create-product',
      name: 'create-product',
      component: () => import('../views/ProductCreate.vue')
    },
    {
      path: '/update-product/:id',
      name: 'update-product',
      component: () => import('../views/ProductUpdate.vue')
    },
  ]
})

export default router

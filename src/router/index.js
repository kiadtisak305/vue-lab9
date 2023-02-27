import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../components/LoginPage.vue'
import RegisterPage from '../components/RegisterPage.vue'
import Home from '../components/Home.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginPage
    }, 
    {
      path: '/register',
      name: 'register',
      component: RegisterPage
    }, 
    {
      path: '/home',
      name: 'home',
      component: Home
    },

  ]
})

export default router

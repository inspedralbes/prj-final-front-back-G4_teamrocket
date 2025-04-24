import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '../components/MainPage.vue'
import LoginView from '../components/LoginPage.vue'
import RegisterView from '../components/RegisterPage.vue'
import ModsView from '@/components/ModsPage.vue'
import { components } from 'vuetify/dist/vuetify-labs.js'

const routes = [
  {
    path: '/',
    name: 'home',
    component: MainPage
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView
  },
  {
    path: '/mods',
    name: 'mods',
    component: ModsView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
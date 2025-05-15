import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '../components/MainPage.vue'
import LoginView from '../components/LoginPage.vue'
import RegisterView from '../components/RegisterPage.vue'
import ModsListView from '@/components/ModsListPage.vue'
import ModDetailView from '@/components/ModDetailPage.vue'
import PerfilView from '@/components/PerfilPage.vue'
import AdministrationView from '@/components/AdministrationPage.vue'

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
    path: '/perfil',
    name: 'perfil',
    component: PerfilView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/mods',
    name: 'mods',
    component: ModsListView
  },
  {
    path: '/mod/:id',
    name: 'mod-detail',
    component: ModDetailView
  },
  {
    path: '/admin',
    name: 'administraction',
    component: AdministrationView,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('userEmail');
  const isAdmin = localStorage.getItem('userAdmin') === '1';

  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login');
  } else if (to.meta.requiresAdmin && !isAdmin) {
    next('/');
  } else {
    next();
  }
});

export default router
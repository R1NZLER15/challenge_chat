import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RoomsView from '../views/chat/RoomsView.vue'
import AdminView from '../views/admin/AdminView.vue'
import AuthView from '../views/AuthView.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/chat/rooms',
      name: 'rooms',
      component: RoomsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: { requiresAuth: true, requiresRoles: ['admin'] }
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthView,
      meta: { authView: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.user) {
    next('/auth')
  } else if (to.meta.requiresRoles && !to.meta.requiresRoles.includes(authStore.user.role)) {
    next('/')
  } else if (to.meta.authView && authStore.user) {
    next('/')
  } else {
    next()
  }
})

export default router

import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/auth/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/pages/auth/Register.vue')
  },
  {
    path: '/',
    component: () => import('@/layout/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'books',
        name: 'Books',
        component: () => import('@/pages/books/Books.vue')
      },
      {
        path: 'categories',
        name: 'Categories',
        component: () => import('@/pages/categories/Categories.vue')
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/pages/profile/Profile.vue'),
      },
      {
        path: 'customers',
        name: 'Customers',
        component: () => import('@/pages/customers/Customers.vue'),
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token')
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
    return
  }
  
  if (isAuthenticated && to.path === '/login') {
    next('/dashboard')
    return
  }
  
  next()
})

export default router

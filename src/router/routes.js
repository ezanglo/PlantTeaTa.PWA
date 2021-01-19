const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('pages/Dashboard.vue')
      },
      {
        path: 'user_management',
        name: 'User Management',
        component: () => import('pages/UserManagement.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'product_management',
        name: 'Product Management',
        component: () => import('pages/product/ProductManagement.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'products',
        name: 'Products',
        component: () => import('pages/product/Products.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('pages/Settings.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('pages/user/Profile.vue'),
        meta: {
          requiresAuth: true
        }
      },
    ]
  },
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: 'forgotPassword',
        name: 'ForgotPassword',
        component: () => import('pages/ForgotPassword.vue')
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('pages/Auth.vue')
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('pages/Auth.vue')
      }
    ]
  },
  {
    path: '/order',
    component: () => import('layouts/OrderLayout.vue'),
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'menu',
        name: 'Menu',
        component: () => import('pages/order/OrderMenu.vue')
      },
    ]
  }
]

// Always leave this as last one
routes.push({
  path: '*',
  component: () => import('pages/Error404.vue')
})

export default routes
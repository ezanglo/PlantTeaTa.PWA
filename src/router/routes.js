const routes = [
  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    meta: {
      requiresAuth: true,
      admin: true
    },
    children: [
      {
        path: '/',
        name: 'Dashboard',
        component: () => import('pages/Dashboard.vue'),
      },
      {
        path: 'user_management',
        name: 'User Management',
        component: () => import('pages/UserManagement.vue'),
      },
      {
        path: '/profile',
        name: 'Profile',
        component: () => import('pages/user/Profile.vue')
      },
      {
        path: 'product_management',
        name: 'Product Management',
        component: () => import('pages/product/ProductManagement.vue'),
      },
      {
        path: 'products',
        name: 'Products',
        component: () => import('pages/product/Products.vue'),
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('pages/Settings.vue'),
      },
      {
        path: 'menu',
        name: 'Menu',
        component: () => import('pages/order/OrderMenu.vue'),
      },
      {
        path: 'sales_report',
        name: 'Sales Report',
        component: () => import('pages/order/SalesReport.vue'),
      },
      {
        path: 'expenses',
        name: 'Expenses',
        component: () => import('pages/Expenses.vue'),
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
    path: '/',
    component: () => import('layouts/CustomerLayout.vue'),
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('pages/Rewards.vue'),
      },
      {
        path: '/customer/profile',
        name: 'Profile',
        component: () => import('pages/user/Profile.vue')
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
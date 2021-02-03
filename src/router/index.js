import firebaseServices from '../services/firebase'
import { Notify } from 'quasar'
import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function ({store}) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  Router.beforeEach(async (to, from, next) => {
    const { ensureAuthIsInitialized, isAuthenticated } = firebaseServices
    try {
      // Force the app to wait until Firebase has
      // finished its initialization, and handle the
      // authentication state of the user properly
      await ensureAuthIsInitialized(store)
      
      // if(isAuthenticated(store)){
      //   await store.dispatch('user/getCurrentUser', store.state.auth.uid)
      // }

      if(store.state.user.currentUser){
        const currentUserRole = store.state.user.currentUser.role
        if(to.matched.some(record => record.meta.admin) && currentUserRole != 'Admin'){
          next('/')
        }
      }
      
      if (to.matched.some(record => record.meta.requiresAuth)) {
        if (isAuthenticated(store)) {
          next()
        } else {
          next('/auth/login')
        }
      } else if ((to.path === '/auth/register' && isAuthenticated(store)) ||
        (to.path === '/auth/login' && isAuthenticated(store))) {
        next('/user')
      } else {
        next()
      }
    } catch (err) {
      console.log(err);
      Notify.create({
        message: `${err}`,
        color: 'negative'
      })
    }
  })

  return Router
}

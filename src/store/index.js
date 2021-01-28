import Vue from 'vue'
import Vuex from 'vuex'
import { vuexfireMutations } from 'vuexfire'

import auth from './auth'
import user from './user'
import product from './product'
import order from './order'
import expense from './expense'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */
let store = null
export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      auth,
      user,
      product,
      order,
      expense
    },
    mutations: {
      ...vuexfireMutations
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })
  store = Store
  return Store
}

export { store }
<template>

  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="leftDrawerOpen = !leftDrawerOpen" />

        <q-toolbar-title>
          Plant Tea-ta
        </q-toolbar-title>

        <q-space/>
        
        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn round dense flat color="white" icon="ion-cart" @click="userCart = true">
            <q-badge v-if="currentUserCart.length > 0" color="red" text-color="white" floating>
              {{currentUserCart.length}}
            </q-badge>
            <q-tooltip>Cart</q-tooltip>
          </q-btn>
        </div>

      </q-toolbar>
    </q-header>
    <q-dialog 
      v-model="userCart" 
      full-height
      :maximized="$q.screen.lt.sm?true:false" 
      position="right"
      transition-show="slide-left"
      transition-hide="slide-right">
        <user-cart/>
    </q-dialog>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>

import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  components: {
    'user-cart': () => import('../components/UserCart.vue')
  },
  data () {
    return {
      userCart: false,
      tab: null
    }
  },
  mounted: function() {
      this.getProductCategories()
        .then(this.getCurrentUserCart)
  },
  computed: {
    ...mapGetters('product', [ 'productCategories', 'productTypes']),
    ...mapGetters('user', [ 'currentUserCart']),
  },
  methods: {
    ...mapActions('product', ['getProductCategories', 'getProductTypes']),
    ...mapActions('user', ['getCurrentUserCart']),
  }
}
</script>
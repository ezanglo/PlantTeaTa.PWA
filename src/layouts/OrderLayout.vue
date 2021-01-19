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
          <q-btn round dense flat color="white" icon="ion-cart" @click="cartDrawerOpen = !cartDrawerOpen">
            <q-badge color="red" text-color="white" floating>
              5
            </q-badge>
            <q-tooltip>Cart</q-tooltip>
          </q-btn>
        </div>

      </q-toolbar>
    </q-header>
    <q-footer elevated>
        <q-tabs 
          v-model="tab" 
          shrink 
          stretch 
          switch-indicator
          indicator-color="blue"
          active-color="blue"
          class="bg-white text-black"
          align="center"
          >
          <q-route-tab 
              :icon="(category.categoryIcon)?category.categoryIcon:'extension'"
              v-for="category in productCategories" 
              :key="category.id" 
              :to="{path: '/order/menu', query: { category: category.categoryName }}" 
              :label="category.categoryName" 
              exact replace
          />
        </q-tabs>
    </q-footer>

    <q-drawer 
      v-model="cartDrawerOpen" 
      side="right" 
      show-if-above 
      bordered 
      behavior="mobile"
      content-class="bg-grey-1" >
      <q-item active>
        <q-item-section avatar>
          <q-icon name="ion-cart" />
        </q-item-section>
        <q-item-section class="text-h6">
          Your Cart
        </q-item-section>
      </q-item>
      <q-item v-for="product in currentUserCart" :key="product.id">
        <q-item-section>
          <q-item-label>{{product.productName}}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>22oz</q-item-label>
        </q-item-section>
        <q-item-section style="width:20px">
          <q-item-label>x2</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>P120</q-item-label>
        </q-item-section>
      </q-item>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
      
  </q-layout>
</template>

<script>

import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  data () {
    return {
      cartDrawerOpen: false,
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
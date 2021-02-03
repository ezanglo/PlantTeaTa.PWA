<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="leftDrawerOpen = !leftDrawerOpen" />

        <q-toolbar-title>
          Plant Tea-ta
        </q-toolbar-title>

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn round dense flat color="white" :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
                 @click="$q.fullscreen.toggle()"
                 v-if="$q.screen.gt.sm">
          </q-btn>

          <q-btn round dense flat color="white" icon="ion-cart" @click="userCart = true">
            <q-badge v-if="currentUserCart.length > 0" color="red" text-color="white" floating>
              {{currentUserCart.length}}
            </q-badge>
            <q-tooltip>Cart</q-tooltip>
          </q-btn>

          <q-btn round dense flat color="white" icon="notifications">
            <q-badge color="red" text-color="white" v-if="notifications.length > 0" floating>
              {{notifications.length}}
            </q-badge>
            <q-menu>
              <q-list style="min-width: 100px">
                <q-card class="text-center no-shadow no-border">
                  <q-item v-if="notifications.length <= 0" style="width:auto">
                    <div>
                      <div class="text-center">
                        No new notifications
                      </div>
                    </div>
                  </q-item>
                  <q-btn v-else label="View All" style="max-width: 120px !important" flat dense
                         class="text-indigo-8"></q-btn>
                </q-card>
              </q-list>
            </q-menu>
            <q-tooltip>Notifications</q-tooltip>
          </q-btn>
          <q-btn round flat>
            <q-avatar size="26px">
              <q-img :src="(currentUser) ? currentUser.profilePhoto: require('src/assets/default_profile.jpg')"></q-img>
            </q-avatar>
            <q-menu>
              <q-list style="min-width: 100px">
                <q-item to="/profile" style="max-width: 420px" clickable v-ripple>
                  <q-item-section avatar>
                    <q-icon name="eva-person-outline"/>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Account</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item @click.native="logoutUser()" style="max-width: 420px" clickable v-ripple>
                  <q-item-section avatar>
                    <q-icon name="eva-log-out-outline"/>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Logout</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-footer elevated v-if="currentRouteName === 'Menu'">
      <q-tabs 
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
            :to="{path: '/admin/menu', query: { category: category.categoryName }}" 
            :label="category.categoryName" 
            exact replace
        />
      </q-tabs>
    </q-footer>
    <q-drawer 
      :mini="miniState"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
      v-model="leftDrawerOpen" 
      show-if-above 
      bordered 
      content-class="bg-grey-1" >
      <q-list>
        <template v-for="(menuItem, index) in menuList">
          <q-item 
            v-ripple
            clickable 
            :key="index" 
            :active="menuItem.name === currentRouteName" 
            :to="menuItem.route"
            active-class="q-item-no-link-highlighting"
          >
            <q-item-section avatar>
              <q-icon :name="menuItem.icon" />
            </q-item-section>
            <q-item-section>
              {{ menuItem.label }}
            </q-item-section>
          </q-item>
          <q-separator :key="'sep' + index"  v-if="menuItem.separator" />
        </template>
      </q-list>
    </q-drawer>
    <q-dialog 
      v-model="userCart" 
      full-height
      :maximized="$q.screen.lt.sm?true:false"
      transition-show="slide-left"
      transition-hide="slide-right">
        <cart></cart>
    </q-dialog>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>

import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'AdminLayout',
  components: {
    'cart': () => import('../components/Cart.vue'),
  },
  data () {
    return {
      notifications: [],
      miniState: true,
      leftDrawerOpen: false,
      userCart: false,
      menuList: [
        {
          name: 'Dashboard',
          icon: 'eva-bar-chart',
          label: 'Dashboard',
          route: '/admin',
          separator: false
        },
        {
          name: 'User Management',
          icon: 'eva-people-outline',
          label: 'Users',
          route: '/admin/user_management',
          separator: false
        },
        {
          name: 'Product Management',
          icon: 'eva-pricetags-outline',
          label: 'Products',
          route: '/admin/product_management',
          separator: false
        },
        {
          name: 'Sales Report',
          icon: 'point_of_sale',
          label: 'Sales Report',
          route: '/admin/sales_report',
          separator: false
        },
        {
          name: 'Expenses',
          icon: 'credit_card',
          label: 'Expenses',
          route: '/admin/expenses',
          separator: false
        },
        {
          name: 'Menu',
          icon: 'eva-shopping-bag-outline',
          label: 'Product Menu',
          route: {path: '/admin/menu', query: { category: 'Classic' }},
          separator: true
        },
        {
          name: 'Settings',
          icon: 'settings',
          label: 'Settings',
          route: '/admin/settings',
          separator: false
        },
      ]
    }
  },
  mounted: function(){
    
  },
  computed: {
    ...mapGetters('user', ['currentUser', 'currentUserCart']),
    ...mapGetters('product', ['productCategories']),
    currentRouteName() {
        return this.$route.name
    }
  },
  methods: {
    ...mapActions('auth', ['logoutUser']),
    ...mapActions('user', ['getCurrentUserCart']),
    ...mapActions('product', ['getProductCategories']),
  }
}
</script>

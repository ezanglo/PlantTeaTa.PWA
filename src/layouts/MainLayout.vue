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
          <q-btn round dense flat color="white" :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
                 @click="$q.fullscreen.toggle()"
                 v-if="$q.screen.gt.sm">
          </q-btn>
          <q-btn round dense flat color="white" icon="notifications">
            <q-badge color="red" text-color="white" floating>
              5
            </q-badge>
            <q-menu>
              <q-list style="min-width: 100px">
                <messages></messages>
                <q-card class="text-center no-shadow no-border">
                  <q-btn label="View All" style="max-width: 120px !important;" flat dense
                         class="text-indigo-8"></q-btn>
                </q-card>
              </q-list>
            </q-menu>
            <q-tooltip>Notifications</q-tooltip>
          </q-btn>
          <q-btn round flat>
            <q-avatar size="26px">
              <q-img :src="(currentUser) ? currentUser.profilePhoto: ''"></q-img>
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
                <!-- <q-card class="text-center no-shadow no-border">
                  <q-btn @click="logoutUser()" label="Logout" style="max-width: 120px !important;" flat dense class="text-indigo-8"></q-btn>
                </q-card> -->
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered content-class="bg-grey-1" >
      <q-list>
        <template v-for="(menuItem, index) in menuList">
          <q-item 
            v-ripple
            clickable 
            :key="index" 
            :active="activeMenu === menuItem.label" 
            @click="activeMenu = menuItem.label"
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

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>

import { mapActions, mapGetters } from 'vuex'
import Messages from "./Messages";

export default {
  name: 'MainLayout',
  data () {
    return {
      leftDrawerOpen: false,
      activeMenu: 'Dashboard',
      menuList: [
        {
          icon: 'eva-bar-chart',
          label: 'Dashboard',
          route: '/',
          separator: false
        },
        {
          icon: 'eva-people-outline',
          label: 'Users',
          route: '/user_management',
          separator: false
        },
        {
          icon: 'eva-pricetags-outline',
          label: 'Products',
          route: '/product_management',
          separator: true
        },
        {
          icon: 'settings',
          label: 'Settings',
          route: '/settings',
          separator: false
        },
        {
          icon: 'eva-pricetags-outline',
          label: 'Ordering System',
          route: '/order/menu',
          separator: false
        },
      ]
    }
  },
  components: {
    Messages
  },
  computed: {
    ...mapGetters('user', ['currentUser']),
  },
  methods: {
    ...mapActions('auth', ['logoutUser'])
  }
}
</script>

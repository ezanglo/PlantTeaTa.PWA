<template>
    <q-layout view="hHh Lpr lFf">
        <q-header elevated>
        <q-toolbar>
            <q-btn flat dense round icon="menu" aria-label="Menu" @click="drawer = !drawer" />
            <q-toolbar-title>Plant Tea-ta</q-toolbar-title>
        </q-toolbar>
        </q-header>

        <q-drawer
        v-model="drawer"
        show-if-above
        :breakpoint="800"
        >
        <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
            <q-list>
                <template v-for="(menuItem, index) in menuList">
                    <q-item 
                        v-ripple
                        clickable 
                        :key="index" 
                        :active="menuItem.name === currentRouteName" 
                        :to="menuItem.route"
                        active-class="q-item-no-link-highlighting">
                        <q-item-section avatar>
                        <q-icon :name="menuItem.icon" />
                        </q-item-section>
                        <q-item-section>
                        {{ menuItem.label }}
                        </q-item-section>
                    </q-item>
                </template>
                <q-separator />
                <q-item 
                    to="/admin"
                    v-ripple
                    clickable 
                    v-if="(currentUser && currentUser.role && currentUser.role == 'Admin')?true:false"
                    active-class="q-item-no-link-highlighting">
                        <q-item-section avatar>
                            <q-icon name="dashboard" />
                        </q-item-section>
                        <q-item-section>
                            Admin Panel
                        </q-item-section>
                </q-item>
                <q-item 
                    @click="logoutUser()"
                    v-ripple
                    clickable 
                    active-class="q-item-no-link-highlighting">
                        <q-item-section avatar>
                            <q-icon name="logout" />
                        </q-item-section>
                        <q-item-section>
                            Logout
                        </q-item-section>
                </q-item>
            </q-list>
        </q-scroll-area>

        <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 150px">
            <div class="absolute-bottom bg-transparent">
            <q-avatar size="56px" class="q-mb-sm">
                <q-img :src="(currentUser) ? currentUser.profilePhoto: require('src/assets/default_profile.jpg')"></q-img>
            </q-avatar>
            <div class="text-weight-bold">{{(currentUser) ? currentUser.fullName : ''}}</div>
            <div>{{(currentUser) ? currentUser.email : ''}}</div>
            </div>
        </q-img>
        </q-drawer>

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    data () {
        return {
            drawer: false,
            menuList: [
                {
                    name: 'Home',
                    icon: 'home',
                    label: 'Home',
                    route: '/',
                    separator: false
                },
                {
                    name: 'settings',
                    icon: 'settings',
                    label: 'My Account',
                    route: '/customer/profile',
                    separator: false
                }

            ]
        }
    },
    computed:{
        ...mapGetters('user', ['currentUser']),
        currentRouteName() {
            return this.$route.name
        }
    },
    mounted: async function(){
        
    },
    methods: {
        ...mapActions('auth', ['logoutUser']),
    }
}
</script>
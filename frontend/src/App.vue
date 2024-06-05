<script setup>
import AppBar from './components/Global/AppBar.vue'
import NavigationSideBar from './components/Global/NavigationSideBar.vue'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const appName = 'Chat Spot'
const appIcon = 'fas fa-users'
const appColor = 'green darken-1'
const authStore = useAuthStore()

const token = authStore.token
if (token) {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`
}
</script>

<template>
  <v-app>
    <AppBar :title="appName" :icon="appIcon" :color="appColor" />
    <NavigationSideBar :profile="authStore.user" />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

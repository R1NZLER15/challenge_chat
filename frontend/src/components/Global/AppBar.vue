<script setup>
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'

let props = defineProps({
  title: String,
  icon: String,
  color: String
})

const authStore = useAuthStore()

let isAuthenticated = computed(() => authStore.user)

function logout() {
  authStore.logout()
}
</script>

<template>
  <v-app-bar :color="color" dark density="compact">
    <v-app-bar-title>
      <v-icon :icon="icon" size="small" end />
      {{ title }}
    </v-app-bar-title>
    <v-spacer></v-spacer>
    <v-btn v-if="isAuthenticated !== null" text @click="logout()">
      <v-icon icon="fas fa-right-from-bracket" start />
      Logout
    </v-btn>
    <v-btn v-else text to="/auth">
      <v-icon icon="fas fa-sign-in-alt" start />
      Login
    </v-btn>
  </v-app-bar>
</template>

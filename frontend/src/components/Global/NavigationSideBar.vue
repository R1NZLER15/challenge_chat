<template>
  <v-navigation-drawer color="grey-lighten-3" rail>
    <v-list v-if="profile" density="compact" nav>
      <v-list-item link title="Profile" prepend-icon="fas fa-user">
        <v-tooltip activator="parent">Username: {{ profile.username }}</v-tooltip>
      </v-list-item>
    </v-list>

    <v-divider class="mx-2"></v-divider>

    <v-list density="compact" nav>
      <v-list-item
        v-for="item in filteredNavigationItems"
        :key="item.title"
        link
        :to="item.route"
        :title="item.title"
      >
        <template v-slot:prepend>
          <v-icon :icon="item.icon" :color="item.color" />
        </template>
        <v-tooltip bottom activator="parent">{{ item.tooltip }}</v-tooltip>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { computed } from 'vue'
import navigationItems from '@/utils/navigationBarItems.json'

const props = defineProps({
  profile: Object
})

function getUserRole() {
  return props.profile ? props.profile.role : ''
}

function userHasRole(roles) {
  if (!roles || roles.length === 0) return true
  return roles.some((role) => getUserRole().includes(role))
}

const filteredNavigationItems = computed(() => {
  return navigationItems.filter((item) => userHasRole(item.roles))
})
</script>

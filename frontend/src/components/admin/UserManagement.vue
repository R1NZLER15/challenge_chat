<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const users = ref([])
const roles = ['user', 'admin']

const authStore = useAuthStore()

const self = authStore.user

onMounted(async () => {
  await getUsers()
})

async function getUsers() {
  const response = await axios.get('http://localhost:3000/api/users')
  users.value = response.data
}

async function setUserRole(userId, role) {
  try {
    console.log('setUserRole', userId, role)
    await axios.put(`http://localhost:3000/api/users/update/${userId}`, { role: role })
    getUsers()
  } catch (error) {
    console.error(error)
  }
}

async function deleteUser(userId) {
  try {
    await axios.delete(`http://localhost:3000/api/users/delete/${userId}`)
    getUsers()
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <v-card>
    <v-card-title>Users</v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item
          v-for="user in users"
          :key="user.id"
          :title="user.username"
          :subtitle="`Role: ${user.role}`"
        >
          <template v-slot:append>
            <v-select
              v-model="user.role"
              :items="roles"
              label="Role"
              density="compact"
              variant="outlined"
              hide-details
              :disabled="user.role === 'guest' || user._id === self._id"
              @update:model-value="setUserRole(user._id, user.role)"
            />
            <v-btn
              color="red"
              @click="deleteUser(user._id)"
              variant="plain"
              :disabled="user._id === self._id"
            >
              <v-icon icon="fas fa-trash" />
              <v-tooltip bottom activator="parent">
                Delete User:
                {{ user.username }}
              </v-tooltip>
            </v-btn>
          </template>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

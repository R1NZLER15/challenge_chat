<script setup>
import RoomManagement from '@/components/admin/RoomManagement.vue'
import UserManagement from '@/components/admin/UserManagement.vue'
import ReportManagement from '@/components/admin/ReportManagement.vue'
import { ref, onMounted } from 'vue'
import axios from 'axios'

//Get the users and rooms from the store
const users = ref([])
const rooms = ref([])
const reports = ref([])

//Fetch the users and rooms from the API
onMounted(async () => {
  const response = await axios.get('http://localhost:3000/api/users')
  users.value = response.data
  const response2 = await axios.get('http://localhost:3000/api/rooms')
  rooms.value = response2.data
  const response3 = await axios.get('http://localhost:3000/api/reports')
  reports.value = response3.data
})
</script>

<template>
  <v-app-bar app color="green-darken-2" dark>
    <v-toolbar-title> Admin Panel </v-toolbar-title>
  </v-app-bar>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <ReportManagement />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <RoomManagement />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <UserManagement />
      </v-col>
    </v-row>
  </v-container>
</template>

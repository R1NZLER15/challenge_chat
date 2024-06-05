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

<script setup>
import RoomManagement from '@/components/admin/RoomManagement.vue'
import UserManagement from '@/components/admin/UserManagement.vue'
import ReportManagement from '@/components/admin/ReportManagement.vue'
</script>

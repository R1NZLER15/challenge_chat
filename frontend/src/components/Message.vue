<template>
  <v-card>
    <v-card-title>{{ message.author }} - {{ message.timestamp }}</v-card-title>
    <v-card-text>{{ message.text }}</v-card-text>
  </v-card>
</template>

<script>
export default {
  props: ['message']
}
</script>

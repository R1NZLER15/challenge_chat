<template>
  <v-col
    cols="10"
    :class="{
      outgoing: isOwnMessage,
      incoming: !isOwnMessage
    }"
    :offset="isOwnMessage ? 2 : 0"
  >
    <v-card-title>
      <span>{{ message.author.username }}</span>
      - {{ displayDateTime }}
      <v-btn v-if="!isOwnMessage" @click="reportMessage(message)" variant="plain">
        <v-icon icon="fas fa-flag" color="red-lighten-3"></v-icon>
        <v-tooltip activator="parent"> Click to report this message </v-tooltip>
      </v-btn>
    </v-card-title>
    <v-card-text>{{ message.text }}</v-card-text>
  </v-col>
</template>

<script setup>
import { reactive, onMounted, watch } from 'vue'
import axios from 'axios'

const props = defineProps(['message', 'user', 'isOwnMessage'])
const userColors = reactive([])

async function reportMessage(msg) {
  if (confirm('Are you sure you want to report this message?')) {
    try {
      await axios.post('http://localhost:3000/api/reports/create', {
        message: msg,
        reportedBy: props.user
      })
      alert('Message reported successfully')
    } catch {
      alert('Failed to report message')
    }
  }
}

const date = new Date(props.message.timestamp)
const displayDateTime = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}, ${date.getHours() % 12}:${date.getMinutes()}:${date.getSeconds()} ${date.getHours() >= 12 ? 'PM' : 'AM'}`
</script>

<style lang="scss">
.outgoing {
  text-align: right;
  background-color: #ecfaec;
}

.incoming {
  text-align: left;
  background-color: #f7f7f7;
}
</style>

<template>
  <v-navigation-drawer app>
    <v-list nav>
      <v-list-item>
        <v-list-item-title>Rooms</v-list-item-title>
      </v-list-item>
      <v-list-item v-for="room in rooms" :key="room._id" @click="joinRoom(room)">
        <v-list-item-title class="font-weight-bold">
          <v-icon icon="fas fa-message" color="green"></v-icon>
          {{ room.name }}
        </v-list-item-title>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item @click="createRoomDialog = true">
        <v-list-item-title class="font-weight-bold">
          <v-icon icon="fas fa-plus" color="green"></v-icon>
          Create New Room
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <template v-if="currentRoom">
    <div ref="messagesContainer" class="messages-container">
      <template v-for="msg in messages" :key="msg._id">
        <v-row class="ma-2">
          <Message :message="msg" :user="authStore.user" :isOwnMessage="isOwnMessage(msg)" />
        </v-row>
      </template>
      <v-empty-state
        v-if="!messages.length"
        icon="fas fa-inbox"
        text="No messages yet"
        title="Start the conversation!"
      />
    </div>
    <v-footer app inset color="grey-lighten-3">
      <v-text-field
        v-model="message"
        label="Message"
        background-color="grey-lighten-2"
        density="compact"
        flat
        hide-details
        class="overflow-hidden"
        rounded="pill"
        variant="solo-filled"
        @keydown.enter="sendMessage"
      />
      <v-btn class="ml-2" @click="sendMessage">Send</v-btn>
    </v-footer>
  </template>

  <v-empty-state
    v-else
    icon="fas fa-search"
    text="You can find all the available rooms on the navigation bar located on the left side of the screen."
    title="Please select a room to start chatting."
  ></v-empty-state>

  <v-dialog v-model="createRoomDialog" max-width="500px">
    <v-card>
      <v-card-title>Create New Room</v-card-title>
      <v-card-text>
        <v-text-field v-model="newRoomName" label="Room Name" @keydown.enter="createRoom" />
      </v-card-text>
      <v-card-actions>
        <v-btn @click="createRoom" color="success">Create</v-btn>
        <v-btn @click="createRoomDialog = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Message from '@/components/Message.vue'
import { io } from 'socket.io-client'
import axios from 'axios'

const authStore = useAuthStore()

const socket = io('http://localhost:3000', {
  auth: {
    token: authStore.token
  }
})

const message = ref('')
const rooms = ref([])
const currentRoom = ref(null)
const messages = ref([])
const createRoomDialog = ref(false)
const newRoomName = ref('')
const messagesContainer = ref(null)

socket.on('receiveMessage', (msg) => {
  console.log('receiveMessage', msg)
  messages.value.push(msg)
})

function joinRoom(room) {
  console.log('joinRoom', room)
  socket.emit('joinRoom', { username: authStore.user.username, room: room._id })
  fetchMessages(room)
  currentRoom.value = room
}

function sendMessage() {
  console.log('sendMessage', message.value.trim(), currentRoom.value)
  if (message.value.trim() && currentRoom.value) {
    const msg = {
      author: authStore.user,
      text: message.value,
      room: currentRoom.value._id,
      timestamp: new Date()
    }
    socket.emit('sendMessage', msg)
    message.value = ''
  }
}

async function fetchMessages(room) {
  const response = await axios.get(`http://localhost:3000/api/rooms/messages/${room._id}`)
  messages.value = response.data
}

async function fetchRooms() {
  const response = await axios.get('http://localhost:3000/api/rooms')
  rooms.value = response.data
}

async function createRoom() {
  try {
    const response = await axios.post('http://localhost:3000/api/rooms/create', {
      name: newRoomName.value,
      createdBy: authStore.user._id
    })
    rooms.value.push(response.data)
    newRoomName.value = ''
    createRoomDialog.value = false
    currentRoom.value = response.data
  } catch (error) {
    console.error(error)
  }
}

function isOwnMessage(msg) {
  return msg.author._id === authStore.user._id
}

function scrollToBottom() {
  if (messagesContainer.value) {
    nextTick(() => {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    })
  }
}

onMounted(async () => {
  await fetchRooms()
})

watch(
  messages,
  () => {
    scrollToBottom()
  },
  { deep: true }
)
</script>

<style lang="scss">
.messages-container {
  height: calc(100vh - 64px - 64px); //Height adjustment for the footer and app bar
  overflow-y: auto;
}
</style>

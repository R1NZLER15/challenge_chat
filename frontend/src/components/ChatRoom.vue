<template>
  <div>
    <v-text-field v-model="username" label="Username" @keydown.enter="joinChat" />
    <v-text-field v-model="message" label="Message" @keydown.enter="sendMessage" />
    <v-btn @click="sendMessage">Send</v-btn>
    <div
      v-for="msg in messages"
      :key="msg._id"
      :class="{ outgoing: msg.author === username, incoming: msg.author !== username }"
    >
      <Message :message="msg" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useChatStore } from '@/stores/chat'
import Message from './Message.vue'
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000')

export default {
  components: { Message },
  setup() {
    const chatStore = useChatStore()
    const username = ref('')
    const message = ref('')
    const messages = ref([])

    socket.on('receiveMessage', (msg) => {
      chatStore.addMessage(msg)
    })

    const joinChat = () => {
      socket.emit('joinRoom', username.value)
    }

    const sendMessage = () => {
      if (message.value.trim()) {
        socket.emit('sendMessage', message.value)
        message.value = ''
      }
    }

    onMounted(async () => {
      await chatStore.fetchMessages()
      messages.value = chatStore.allMessages
    })

    return { username, message, messages, joinChat, sendMessage }
  }
}
</script>

<style lang="scss">
.outgoing {
  text-align: right;
  background-color: #e0ffe0;
}

.incoming {
  text-align: left;
  background-color: #ffe0e0;
}
</style>

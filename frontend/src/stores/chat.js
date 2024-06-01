import { defineStore } from 'pinia'

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: []
  }),
  actions: {
    setMessages(messages) {
      this.messages = messages
    },
    addMessage(message) {
      this.messages.push(message)
    },
    async fetchMessages() {
      const res = await fetch('http://localhost:3000/api/chat/messages')
      const data = await res.json()
      this.setMessages(data.reverse())
    }
  },
  getters: {
    allMessages: (state) => state.messages
  }
})

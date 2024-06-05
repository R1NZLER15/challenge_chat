<template>
  <v-empty-state
    title="Welcome to Chat Spot"
    subtitle="Chat Spot is a chat application that allows you to chat with other users in real-time."
    icon="fas fa-comments"
    color="primary"
  >
    <template v-slot:actions>
      <v-btn color="primary" to="/chat/rooms">
        <v-icon icon="fas fa-comments" start />
        Start Chatting
      </v-btn>
    </template>
  </v-empty-state>
</template>

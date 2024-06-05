<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'

const rooms = ref([])
const newRoomName = ref('')
const createRoomDialog = ref(false)

onMounted(async () => {
  await getRooms()
})

const createRoom = async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/rooms/create', {
      name: newRoomName.value
    })
    rooms.value.push(response.data)
    newRoomName.value = ''
    createRoomDialog.value = false
  } catch (error) {
    console.error(error)
  }
}

async function getRooms() {
  const response = await axios.get('http://localhost:3000/api/rooms')
  rooms.value = response.data
}

async function deleteRoom(roomId) {
  try {
    await axios.delete(`http://localhost:3000/api/rooms/delete/${roomId}`)
    getRooms()
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <v-card>
    <v-card-title>Rooms</v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item
          v-for="room in rooms"
          :key="room._id"
          :title="room.name"
          :subtitle="`Created by: ${room.createdBy.username}`"
        >
          <template v-slot:append>
            <v-btn color="red" @click="deleteRoom(room._id)" variant="plain">
              <v-icon icon="fas fa-trash" />
              <v-tooltip bottom activator="parent">
                Delete Room:
                {{ room.name }}
              </v-tooltip>
            </v-btn>
          </template>
        </v-list-item>
        <v-list-item>
          <v-btn @click="createRoomDialog = true" color="green" variant="plain">
            <v-icon start icon="fas fa-plus" />
            Create Room
          </v-btn>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-dialog v-model="createRoomDialog" max-width="500px">
      <v-card>
        <v-card-title>Create Room</v-card-title>
        <v-card-text>
          <v-text-field v-model="newRoomName" label="Room Name"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="createRoomDialog = false">Cancel</v-btn>
          <v-btn @click="createRoom">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

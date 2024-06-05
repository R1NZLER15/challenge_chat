<template>
  <v-container fluid class="fill-height">
    <v-row justify="center">
      <v-col cols="12" md="10" align-self="center">
        <v-card>
          <v-card-title>
            <v-icon start icon="fas fa-user"></v-icon>
            Please login or register
          </v-card-title>
          <v-tabs v-model="tab" align-tabs="center" background-color="primary" dark grow>
            <!--Register and login-->
            <v-tab value="login">
              <v-icon start icon="fas fa-sign-in-alt"></v-icon>
              Login
            </v-tab>
            <v-tab value="register">
              <v-icon start icon="fas fa-user-plus"></v-icon>
              Register
            </v-tab>
          </v-tabs>
          <v-card-text>
            <v-tabs-window v-model="tab">
              <v-tabs-window-item value="login">
                <v-form @submit.prevent="login">
                  <v-text-field
                    v-model="username"
                    label="Username"
                    required
                    :rules="[rules.username]"
                    autocomplete="username"
                  ></v-text-field>
                  <v-text-field
                    v-model="password"
                    label="Password"
                    type="password"
                    :rules="[rules.required]"
                    required
                    autocomplete="current-password"
                  ></v-text-field>
                  <v-spacer />
                  <v-checkbox v-model="remember" label="Remember session"></v-checkbox>
                  <v-btn type="submit" class="ma-2">Login</v-btn>
                  <v-btn @click="guestLogin" class="ma-2">Join as Guest</v-btn>
                </v-form>
              </v-tabs-window-item>
              <v-tabs-window-item value="register">
                <v-form @submit.prevent="submitForm">
                  <v-text-field
                    v-model="username"
                    label="Username"
                    :rules="[rules.username]"
                    required
                    autocomplete="username"
                  >
                  </v-text-field>
                  <v-text-field
                    v-model="password"
                    label="Password"
                    type="password"
                    :rules="[rules.pass]"
                    required
                    autocomplete="new-password"
                  ></v-text-field>
                  <v-text-field
                    v-model="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    :rules="[rules.passConfirm(password)]"
                    required
                    autocomplete="new-password"
                  ></v-text-field>
                  <v-spacer />
                  <v-checkbox v-model="remember" label="Remember session"></v-checkbox>
                  <v-btn type="submit" class="ma-2">Register</v-btn>
                  <v-btn @click="guestLogin" class="ma-2">Join as Guest</v-btn>
                </v-form>
              </v-tabs-window-item>
            </v-tabs-window>
          </v-card-text>
        </v-card>
        <v-alert v-if="error" type="error">{{ error }}</v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { rules } from '@/utils/validation'

const authStore = useAuthStore()
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const role = ref('user')
const remember = ref(false)
const error = computed(() => authStore.error)
const tab = ref('')

async function submitForm() {
  await authStore.register(username.value, password.value, role.value, remember.value)
}

async function login() {
  await authStore.login(username.value, password.value, remember.value)
}

async function guestLogin() {
  await authStore.guestLogin()
}

watch(tab, () => {
  username.value = ''
  password.value = ''
  confirmPassword.value = ''
  authStore.error = ''
})
</script>

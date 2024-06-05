import { defineStore } from 'pinia'
import axios from 'axios'
import router from '../router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user:
      JSON.parse(localStorage.getItem('user')) ||
      JSON.parse(sessionStorage.getItem('user')) ||
      null,
    token: localStorage.getItem('token') || sessionStorage.getItem('token') || null,
    error: null
  }),
  actions: {
    async register(username, password, role, rememberMe) {
      try {
        const response = await axios.post('http://localhost:3000/api/auth/register', {
          username,
          password,
          role
        })
        this.user = response.data.user
        this.token = response.data.token
        this.error = null
        if (rememberMe) {
          localStorage.setItem('user', JSON.stringify(this.user))
          localStorage.setItem('token', this.token)
        } else {
          sessionStorage.setItem('user', JSON.stringify(this.user))
          sessionStorage.setItem('token', this.token)
        }
        location.reload()
      } catch (error) {
        this.error = error.response.data.message
      }
    },
    async login(username, password, rememberMe) {
      try {
        const response = await axios.post('http://localhost:3000/api/auth/login', {
          username,
          password
        })
        this.user = response.data.user
        this.token = response.data.token
        this.error = null
        if (rememberMe) {
          localStorage.setItem('user', JSON.stringify(this.user))
          localStorage.setItem('token', this.token)
        } else {
          sessionStorage.setItem('user', JSON.stringify(this.user))
          sessionStorage.setItem('token', this.token)
        }
        location.reload()
      } catch (error) {
        this.error = error.response.data.message
      }
    },
    async guestLogin() {
      const response = await axios.post('http://localhost:3000/api/auth/guest')
      this.user = response.data.user
      this.token = response.data.token
      sessionStorage.setItem('user', JSON.stringify(this.user))
      sessionStorage.setItem('token', this.token)
      location.reload()
    },
    async logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      sessionStorage.removeItem('user')
      sessionStorage.removeItem('token')
      router.push('/auth')
    },

    async setToken(token) {
      this.token = token
    },

    async checkAuth() {
      try {
        const response = await axios.get('http://localhost:3000/api/auth/checkAuth', {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })
        this.user = response.data
        localStorage.setItem('user', JSON.stringify(this.user))
        sessionStorage.setItem('user', JSON.stringify(this.user))
      } catch (error) {
        this.user = null
        this.token = null
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        sessionStorage.removeItem('user')
        sessionStorage.removeItem('token')
      }
    }
  }
})

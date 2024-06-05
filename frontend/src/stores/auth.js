import { defineStore } from 'pinia'
import axios from 'axios'
import router from '../router'

/**
 * A Vuex store module for managing authentication state.
 */
export const useAuthStore = defineStore('auth', {
  state: () => ({
    /**
     * The user object representing the authenticated user.
     * Initialized with user data from localStorage or sessionStorage, or null if not available.
     * @type {Object|null}
     */
    user:
      JSON.parse(localStorage.getItem('user')) ||
      JSON.parse(sessionStorage.getItem('user')) ||
      null,
    /**
     * The authentication token for the authenticated user.
     * Initialized with the token from localStorage or sessionStorage, or null if not available.
     * @type {string|null}
     */
    token: localStorage.getItem('token') || sessionStorage.getItem('token') || null,
    /**
     * The error message associated with authentication actions.
     * @type {string|null}
     */
    error: null
  }),
  actions: {
    /**
     * Registers a new user.
     * @param {string} username - The username of the new user.
     * @param {string} password - The password of the new user.
     * @param {string} role - The role of the new user.
     * @param {boolean} rememberMe - Whether to remember the user's authentication.
     */
    async register(username, password, role, rememberMe) {
      try {
        const response = await axios.post('http://localhost:3000/api/auth/register', {
          username,
          password,
          role
        });
        this.setUserAndToken(response.data.user, response.data.token, rememberMe);
        location.reload(); // Reload to reflect changes
      } catch (error) {
        this.error = error.response.data.message; // Set error message
      }
    },
    /**
     * Logs in an existing user.
     * @param {string} username - The username of the user.
     * @param {string} password - The password of the user.
     * @param {boolean} rememberMe - Whether to remember the user's authentication.
     */
    async login(username, password, rememberMe) {
      try {
        const response = await axios.post('http://localhost:3000/api/auth/login', {
          username,
          password
        });
        this.setUserAndToken(response.data.user, response.data.token, rememberMe);
        location.reload(); // Reload to reflect changes
      } catch (error) {
        this.error = error.response.data.message; // Set error message
      }
    },
    /**
     * Logs in as a guest user.
     */
    async guestLogin() {
      const response = await axios.post('http://localhost:3000/api/auth/guest');
      this.setUserAndToken(response.data.user, response.data.token, false);
      location.reload(); // Reload to reflect changes
    },
    /**
     * Logs out the current user.
     */
    async logout() {
      this.clearUserAndToken();
      router.push('/auth'); // Redirect to auth page
    },
    /**
     * Sets the authentication token manually.
     * @param {string} token - The authentication token.
     */
    async setToken(token) {
      this.token = token;
    },
    /**
     * Checks if the user is authenticated.
     */
    async checkAuth() {
      try {
        const response = await axios.get('http://localhost:3000/api/auth/checkAuth', {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });
        this.user = response.data;
        this.storeUserData();
      } catch (error) {
        this.clearUserAndToken();
      }
    },
    /**
     * Sets the user and token in state and storage.
     * @param {Object} user - The user object.
     * @param {string} token - The authentication token.
     * @param {boolean} rememberMe - Whether to remember the user's authentication.
     */
    setUserAndToken(user, token, rememberMe) {
      this.user = user;
      this.token = token;
      this.error = null;
      if (rememberMe) {
        localStorage.setItem('user', JSON.stringify(this.user));
        localStorage.setItem('token', this.token);
      } else {
        sessionStorage.setItem('user', JSON.stringify(this.user));
        sessionStorage.setItem('token', this.token);
      }
    },
    /**
     * Clears the user and token from state and storage.
     */
    clearUserAndToken() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');
    },
    /**
     * Stores user data in localStorage and sessionStorage.
     */
    storeUserData() {
      localStorage.setItem('user', JSON.stringify(this.user));
      sessionStorage.setItem('user', JSON.stringify(this.user));
    }
  }
});

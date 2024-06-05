// Composables
import { createApp } from 'vue'

// Main component
import App from './App.vue'

// Plugins
import { registerPlugins } from '@/plugins'

const app = createApp(App)

registerPlugins(app)

app.mount('#app')

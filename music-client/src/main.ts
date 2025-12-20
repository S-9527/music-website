import ElementPlus from 'element-plus'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'element-plus/dist/index.css'
import './assets/css/index.scss'

// Create Pinia instance
const pinia = createPinia()

createApp(App).use(pinia).use(router).use(ElementPlus).mount('#app')

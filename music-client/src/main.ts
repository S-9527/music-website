import type { Store } from 'vuex'
import ElementPlus from 'element-plus'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'element-plus/dist/index.css'
import './assets/css/index.scss'

import './assets/icons/index.js'

declare module '@vue/runtime-core' {
  interface State {
    count: number
  }

  interface ComponentCustomProperties {
    $store: Store<State>
  }
}

createApp(App).use(store).use(router).use(ElementPlus).mount('#app')

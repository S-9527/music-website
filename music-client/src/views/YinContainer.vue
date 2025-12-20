<script lang="ts" setup>
import YinAudio from '@/components/layouts/YinAudio.vue'
import YinCurrentPlay from '@/components/layouts/YinCurrentPlay.vue'
import YinFooter from '@/components/layouts/YinFooter.vue'
import YinHeader from '@/components/layouts/YinHeader.vue'
import YinPlayBar from '@/components/layouts/YinPlayBar.vue'
import YinScrollTop from '@/components/layouts/YinScrollTop.vue'
import { useConfigureStore, useSongStore, useUserStore } from '@/store'

const configureStore = useConfigureStore()
const songStore = useSongStore()
const userStore = useUserStore()

// Get all store state data for persistence
function getAllStoreState() {
  return {
    configure: configureStore.$state,
    song: songStore.$state,
    user: userStore.$state,
  }
}

// Restore store state from sessionStorage
if (sessionStorage.getItem('dataStore')) {
  const savedState = JSON.parse(sessionStorage.getItem('dataStore')!)

  // Restore each store's state
  if (savedState.configure) {
    configureStore.$patch(savedState.configure)
  }
  if (savedState.song) {
    songStore.$patch(savedState.song)
  }
  if (savedState.user) {
    userStore.$patch(savedState.user)
  }
}

// Save store states to sessionStorage before unload
window.addEventListener('beforeunload', () => {
  sessionStorage.setItem('dataStore', JSON.stringify(getAllStoreState()))
})
</script>

<template>
  <el-container>
    <el-header>
      <YinHeader />
    </el-header>
    <el-main>
      <router-view />
      <YinCurrentPlay />
      <YinPlayBar />
      <YinScrollTop />
      <YinAudio />
    </el-main>
    <el-footer>
      <YinFooter />
    </el-footer>
  </el-container>
</template>

<style lang="scss" scoped>
@import "@/assets/css/var.scss";
@import "@/assets/css/global.scss";

.el-container {
  min-height: calc(100% - 60px);
}
.el-header {
  padding: 0;
}
.el-main {
  padding-left: 0;
  padding-right: 0;
}
</style>

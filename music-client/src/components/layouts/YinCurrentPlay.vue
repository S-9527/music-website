<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { useApp } from '@/composables/useApp'
import { useConfigureStore, useSongStore } from '@/store'

const { getSongTitle, playMusic } = useApp()
const songStore = useSongStore()
const configureStore = useConfigureStore()

const songId = computed(() => songStore.songId) // 音乐 ID
const currentPlayList = computed(() => songStore.currentPlayList) // 当前播放
const showAside = computed(() => configureStore.showAside) // 是否显示侧边栏

onMounted(() => {
  document.addEventListener('click', () => {
    configureStore.setShowAside(false)
  }, true)
})
</script>

<template>
  <transition name="aside-fade">
    <div v-if="showAside" class="yin-current-play">
      <h2 class="title">
        当前播放
      </h2>
      <div class="control">
        共 {{ (currentPlayList && currentPlayList.length) || 0 }} 首
      </div>
      <ul class="menus">
        <li
          v-for="(item, index) in currentPlayList"
          :key="index"
          :class="{ 'is-play': songId === item.id }"
          @click="playMusic({
            id: item.id,
            url: item.url,
            pic: item.pic,
            index,
            name: item.name,
            lyric: item.lyric,
            currentSongList: currentPlayList,
          })"
        >
          {{ getSongTitle(item.name) }}
        </li>
      </ul>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
@import "@/assets/css/yin-current-play.scss";
</style>

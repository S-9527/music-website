<script lang="ts">
import { computed, defineComponent, getCurrentInstance, onMounted } from 'vue'
import { useStore } from 'vuex'
import mixin from '@/mixins/mixin'

export default defineComponent({
  setup() {
    const { proxy } = getCurrentInstance()
    const store = useStore()
    const { getSongTitle, playMusic } = mixin()

    const songId = computed(() => store.getters.songId) // 音乐 ID
    const currentPlayList = computed(() => store.getters.currentPlayList) // 当前播放
    const showAside = computed(() => store.getters.showAside) // 是否显示侧边栏

    onMounted(() => {
      document.addEventListener('click', () => {
        proxy.$store.commit('setShowAside', false)
      }, true)
    })

    return {
      songId,
      currentPlayList,
      showAside,
      getSongTitle,
      playMusic,
    }
  },
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

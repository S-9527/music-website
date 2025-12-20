<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import YinNav from '@/components/layouts/YinNav.vue'
import SearchSong from './SearchSong.vue'
import SearchSongList from './SearchSongList.vue'

const searchNavList = [
  {
    name: '歌曲',
    value: SearchSong,
  },
  {
    name: '歌单',
    value: SearchSongList,
  },
]

const activeName = ref('歌曲')
const currentView = shallowRef(SearchSong)

function handleChangeView(item: { name: string, value: any }) {
  activeName.value = item.name
  currentView.value = item.value
}
</script>

<template>
  <div class="search">
    <YinNav :style-list="searchNavList" :active-name="activeName" @click="handleChangeView" />
    <component :is="currentView" class="search-list" />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/css/var.scss";
@import "@/assets/css/global.scss";

.search {
  margin: auto;
  width: 900px;

  .search-list {
    min-height: 480px;
  }
}
</style>

<script lang="ts">
import { defineComponent } from 'vue'
import YinNav from '@/components/layouts/YinNav.vue'
import SearchSong from './SearchSong.vue'
import SearchSongList from './SearchSongList.vue'

export default defineComponent({
  components: {
    YinNav,
    SearchSong,
    SearchSongList,
  },
  data() {
    return {
      searchNavList: [
        {
          name: '歌曲',
          value: 'SearchSong',
        },
        {
          name: '歌单',
          value: 'SearchSongList',
        },
      ],
      activeName: '歌曲',
      currentView: 'SearchSong',
    }
  },
  methods: {
    handleChangeView(item) {
      this.activeName = item.name
      this.currentView = item.value
    },
  },
})
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

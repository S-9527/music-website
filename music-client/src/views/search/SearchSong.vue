<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { HttpManager } from '@/api'
import SongList from '@/components/SongList.vue'
import { useConfigureStore } from '@/store'

const configureStore = useConfigureStore()
const route = useRoute()

const currentSongList = ref<any[]>([]) // 存放的音乐
const searchWord = computed(() => configureStore.searchWord)

watch(searchWord, (value) => {
  searchSong(value)
})

// 搜索音乐
async function searchSong(value: string) {
  if (!value) {
    currentSongList.value = []
    return
  }
  const result = await HttpManager.getSongOfSingerName(value)
  if (!result.data.length) {
    currentSongList.value = []
    ElMessage({
      message: '暂时没有相关歌曲',
      type: 'warning',
    })
  }
  else {
    currentSongList.value = result.data
  }
}

onMounted(() => {
  searchSong(route.query.keywords as string || '')
})
</script>

<template>
  <div class="search-song">
    <SongList :song-list="currentSongList" />
  </div>
</template>

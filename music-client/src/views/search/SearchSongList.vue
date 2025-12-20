<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { HttpManager } from '@/api'
import PlayList from '@/components/PlayList.vue'
import { useConfigureStore } from '@/store'

const configureStore = useConfigureStore()
const route = useRoute()

const playList = ref([])
const searchWord = computed(() => configureStore.getSearchWord)

watch(searchWord, (value) => {
  getSearchList(value)
})

async function getSearchList(value) {
  if (!value)
    return
  const result = await HttpManager.getSongListOfLikeTitle(value)
  if (!result.data.length) {
    ElMessage({
      message: '暂无该歌曲内容',
      type: 'warning',
    })
  }
  else {
    playList.value = result.data
  }
}

onMounted(() => {
  getSearchList(route.query.keywords as string || '')
})
</script>

<template>
  <div class="search-song-list">
    <PlayList :play-list="playList" path="song-sheet-detail" />
  </div>
</template>

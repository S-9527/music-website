<script lang="ts">
import { computed, defineComponent, getCurrentInstance, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { HttpManager } from '@/api'
import SongList from '@/components/SongList.vue'

export default defineComponent({
  components: {
    SongList,
  },
  setup() {
    const { proxy } = getCurrentInstance()
    const store = useStore()

    const currentSongList = ref([]) // 存放的音乐
    const searchWord = computed(() => store.getters.searchWord)
    watch(searchWord, (value) => {
      searchSong(value)
    })

    // 搜索音乐
    async function searchSong(value) {
      if (!value) {
        currentSongList.value = []
        return
      }
      const result = (await HttpManager.getSongOfSingerName(value)) as ResponseBody
      if (!result.data.length) {
        currentSongList.value = [];
        (proxy as any).$message({
          message: '暂时没有相关歌曲',
          type: 'warning',
        })
      }
      else {
        currentSongList.value = result.data
      }
    }

    onMounted(() => {
      searchSong(proxy.$route.query.keywords)
    })

    return {
      currentSongList,
    }
  },
})
</script>

<template>
  <div class="search-song">
    <SongList :song-list="currentSongList" />
  </div>
</template>

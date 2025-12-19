<script lang="ts">
import { computed, defineComponent, getCurrentInstance, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { HttpManager } from '@/api'
import PlayList from '@/components/PlayList.vue'

export default defineComponent({
  components: {
    PlayList,
  },
  setup() {
    const { proxy } = getCurrentInstance()
    const store = useStore()

    const playList = ref([])
    const searchWord = computed(() => store.getters.searchWord)
    watch(searchWord, (value) => {
      getSearchList(value)
    })

    async function getSearchList(value) {
      if (!value)
        return
      const result = (await HttpManager.getSongListOfLikeTitle(value)) as ResponseBody
      if (!result.data.length) {
        (proxy as any).$message({
          message: '暂无该歌曲内容',
          type: 'warning',
        })
      }
      else {
        playList.value = result.data
      }
    }

    onMounted(() => {
      getSearchList(proxy.$route.query.keywords)
    })

    return {
      playList,
    }
  },
})
</script>

<template>
  <div class="search-song-list">
    <PlayList :play-list="playList" path="song-sheet-detail" />
  </div>
</template>

<script lang="ts" setup>
import type { SongList } from '@/types'
import { computed, onMounted, ref } from 'vue'
import { HttpManager } from '@/api'
import YinNav from '@/components/layouts/YinNav.vue'
import PlayList from '@/components/PlayList.vue'
import { SONGSTYLE } from '@/enums'

const activeName = ref('全部歌单')
const pageSize = ref(15) // 页数
const currentPage = ref(1) // 当前页
const songStyle = ref(SONGSTYLE) // 歌单导航栏类别
const allPlayList = ref<SongList[]>([]) // 歌单

const data = computed(() => allPlayList.value.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value))

// 获取全部歌单
async function getSongList() {
  const result = await HttpManager.getSongList()
  allPlayList.value = result.data
  currentPage.value = 1
}

// 通过类别获取歌单
async function getSongListOfStyle(style: string) {
  const result = await HttpManager.getSongListOfStyle(style)
  allPlayList.value = result.data
  currentPage.value = 1
}

// 获取歌单
async function handleChangeView(item: { name: string }) {
  activeName.value = item.name
  allPlayList.value = []
  try {
    if (item.name === '全部歌单') {
      await getSongList()
    }
    else {
      await getSongListOfStyle(item.name)
    }
  }
  catch (error) {
    console.error(error)
  }
}

// 获取当前页
function handleCurrentChange(val: number) {
  currentPage.value = val
}

onMounted(() => {
  getSongList().catch((error) => {
    console.error(error)
  })
})
</script>

<template>
  <div class="play-list-container">
    <YinNav :style-list="songStyle" :active-name="activeName" @click="handleChangeView" />
    <PlayList :play-list="data" path="song-sheet-detail" />
    <el-pagination
      class="pagination"
      background
      layout="total, prev, pager, next"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="allPlayList.length"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

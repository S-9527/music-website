<script lang="ts" setup>
import type { PageResult, SongList } from '@/types'
import { onMounted, ref } from 'vue'
import { HttpManager } from '@/api'
import YinNav from '@/components/layouts/YinNav.vue'
import PlayList from '@/components/PlayList.vue'
import { SONGSTYLE } from '@/enums'

const activeName = ref('全部歌单')
const pageSize = ref(10) // 页数 - changed to 10 per requirement
const currentPage = ref(1) // 当前页
const total = ref(0) // 总数
const songStyle = ref(SONGSTYLE) // 歌单导航栏类别
const allPlayList = ref<SongList[]>([]) // 歌单

// 获取全部歌单
async function getSongList(pageNum: number = 1) {
  const result = await HttpManager.getSongList({
    pageNum,
    pageSize: pageSize.value
  })
  const pageResult = result.data as PageResult<SongList>
  allPlayList.value = pageResult.records
  total.value = pageResult.total
  currentPage.value = pageNum
}

// 通过类别获取歌单
async function getSongListOfStyle(style: string, pageNum: number = 1) {
  const result = await HttpManager.getSongListOfStyle(style, {
    pageNum,
    pageSize: pageSize.value
  })
  const pageResult = result.data as PageResult<SongList>
  allPlayList.value = pageResult.records
  total.value = pageResult.total
  currentPage.value = pageNum
}

// 获取歌单
async function handleChangeView(item: { name: string }) {
  activeName.value = item.name
  allPlayList.value = []
  try {
    if (item.name === '全部歌单') {
      await getSongList(1)
    }
    else {
      await getSongListOfStyle(item.name, 1)
    }
  }
  catch (error) {
    console.error(error)
  }
}

// 获取当前页
function handleCurrentChange(val: number) {
  if (activeName.value === '全部歌单') {
    getSongList(val)
  } else {
    getSongListOfStyle(activeName.value, val)
  }
}

onMounted(() => {
  getSongList(1).catch((error) => {
    console.error(error)
  })
})
</script>

<template>
  <div class="play-list-container">
    <YinNav :style-list="songStyle" :active-name="activeName" @click="handleChangeView" />
    <PlayList :play-list="allPlayList" path="song-sheet-detail" />
    <el-pagination
      class="pagination"
      background
      layout="total, prev, pager, next"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

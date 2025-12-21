<script lang="ts" setup>
import type { PageResult, ResponseBody, Singer } from '@/types'
import { onMounted, ref } from 'vue'
import { HttpManager } from '@/api'
import YinNav from '@/components/layouts/YinNav.vue'
import PlayList from '@/components/PlayList.vue'
import { singerStyle } from '@/enums'

// data
const activeName = ref('全部歌手')
const pageSize = ref(10) // 页数 - changed to 10 per requirement
const currentPage = ref(1) // 当前页
const total = ref(0) // 总数
const allPlayList = ref<Singer[]>([])

// 获取所有歌手
async function getAllSinger(pageNum: number = 1) {
  const result = await HttpManager.getAllSinger({
    pageNum,
    pageSize: pageSize.value
  })
  const pageResult = result.data as PageResult<Singer>
  allPlayList.value = pageResult.records || []
  total.value = pageResult.total
  currentPage.value = pageNum
}

onMounted(() => {
  getAllSinger()
})

// 获取当前页
function handleCurrentChange(val: number) {
  if (activeName.value === '全部歌手') {
    getAllSinger(val)
  } else {
    // Get the type from the active item
    const activeItem = singerStyle.find(item => item.name === activeName.value)
    if (activeItem) {
      getSingerSex(activeItem.type, val)
    }
  }
}

function handleChangeView(item: { name: string, type: number }) {
  activeName.value = item.name
  allPlayList.value = []
  if (item.name === '全部歌手') {
    getAllSinger(1)
  } else {
    getSingerSex(item.type, 1)
  }
}

// 通过性别对歌手分类
async function getSingerSex(sex: number, pageNum: number = 1) {
  const result = await HttpManager.getSingerOfSex(sex, {
    pageNum,
    pageSize: pageSize.value
  })
  const pageResult = result.data as PageResult<Singer>
  allPlayList.value = pageResult.records || []
  total.value = pageResult.total
  currentPage.value = pageNum
}
</script>

<template>
  <div class="play-list-container">
    <YinNav :style-list="singerStyle" :active-name="activeName" @click="handleChangeView" />
    <PlayList :play-list="allPlayList" path="singer-detail" />
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

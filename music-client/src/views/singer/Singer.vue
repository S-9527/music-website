<script lang="ts" setup>
import type { ResponseBody } from '@/api'
import { computed, ref } from 'vue'
import { HttpManager } from '@/api'
import YinNav from '@/components/layouts/YinNav.vue'
import PlayList from '@/components/PlayList.vue'
import { singerStyle } from '@/enums'

// data
const activeName = ref('全部歌手')
const pageSize = ref(15) // 页数
const currentPage = ref(1) // 当前页
const allPlayList = ref([])
// computed
const data = computed(() => {
  return allPlayList.value.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value)
})

// 获取所有歌手
async function getAllSinger() {
  const result = (await HttpManager.getAllSinger()) as ResponseBody
  currentPage.value = 1
  allPlayList.value = result.data
}

getAllSinger()

// 获取当前页
function handleCurrentChange(val) {
  currentPage.value = val
}

function handleChangeView(item) {
  activeName.value = item.name
  allPlayList.value = []
  if (item.name === '全部歌手') {
    getAllSinger()
  }
  getSingerSex(item.type)
}

// 通过性别对歌手分类
async function getSingerSex(sex) {
  const result = (await HttpManager.getSingerOfSex(sex)) as ResponseBody
  currentPage.value = 1
  allPlayList.value = result.data
}
</script>

<template>
  <div class="play-list-container">
    <YinNav :style-list="singerStyle" :active-name="activeName" @click="handleChangeView" />
    <PlayList :play-list="data" path="singer-detail" />
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

<script lang="ts" setup>
import type { PageResult, Singer, SongList, SwiperItem } from '@/types'
import { onMounted, ref } from 'vue'
import { HttpManager } from '@/api'
import PlayList from '@/components/PlayList.vue'
import { useApp } from '@/composables/useApp'
import { NavName } from '@/enums'

const { changeIndex } = useApp()

const songList = ref<SongList[]>([]) // 歌单列表
const singerList = ref<Singer[]>([]) // 歌手列表
const swiperList = ref<SwiperItem[]>([])// 轮播图 每次都在进行查询

  HttpManager.getBannerList().then((res) => {
    swiperList.value = res.data.sort()
  })

  // Get first page of song lists (default 10 items per page)
  HttpManager.getSongList({ pageNum: 1, pageSize: 10 }).then((res) => {
    const pageResult = res.data as PageResult<SongList>
    songList.value = pageResult.records.sort()
  })

  // Get first page of singers (default 10 items per page)
  HttpManager.getAllSinger({ pageNum: 1, pageSize: 10 }).then((res) => {
    const pageResult = res.data as PageResult<Singer>
    singerList.value = pageResult.records.sort()
  })

onMounted(() => {
  changeIndex(NavName.Home)
})
</script>

<template>
  <!-- 轮播图 -->
  <el-carousel v-if="swiperList.length" class="swiper-container" type="card" height="20vw" :interval="4000">
    <el-carousel-item v-for="(item, index) in swiperList" :key="index">
      <img :src="HttpManager.attachImageUrl(item.pic)" alt="">
    </el-carousel-item>
  </el-carousel>
  <!-- 热门歌单 -->
  <PlayList class="play-list-container" title="歌单" path="song-sheet-detail" :play-list="songList" />
  <!-- 热门歌手 -->
  <PlayList class="play-list-container" title="歌手" path="singer-detail" :play-list="singerList" />
</template>

<style lang="scss" scoped>
@import "@/assets/css/var.scss";

/*轮播图*/
.swiper-container {
  width: 90%;
  margin: auto;
  padding-top: 20px;
  img {
    width: 100%;
  }
}

.swiper-container:deep(.el-carousel__indicators.el-carousel__indicators--outside) {
  display: inline-block;
  transform: translateX(30vw);
}

.el-slider__runway {
  background-color: $color-blue;
}
</style>

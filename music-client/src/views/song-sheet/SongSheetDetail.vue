<script lang="ts" setup>
import type { Song } from '@/types'
import { ElMessage } from 'element-plus'
import { computed, ref } from 'vue'
import { HttpManager } from '@/api'
import Comment from '@/components/Comment.vue'
import SongList from '@/components/SongList.vue'
import { useApp } from '@/composables/useApp'
import { useSongStore, useUserStore } from '@/store'

const songStore = useSongStore()
const userStore = useUserStore()
const { checkStatus } = useApp()

// Define attachImageUrl for use in template
const attachImageUrl = HttpManager.attachImageUrl

const currentSongList = ref<Song[]>([]) // 存放的音乐
const nowSongListId = ref('') // 歌单 ID
const nowScore = ref(0)
const nowRank = ref(0)
const disabledRank = ref(false)
const assistText = ref('评价')

const songDetails = computed(() => songStore.songDetails) // 单个歌单信息
const nowUserId = computed(() => userStore.userId)

nowSongListId.value = songDetails.value?.id || '' // 给歌单ID赋值

// For template access - make sure these are available with the exact names used in template
const score = nowScore
const rank = nowRank
const songListId = nowSongListId

// 收集歌单里面的歌曲
async function getSongId(id: string) {
  const result = await HttpManager.getListSongOfSongId(id)
  // 获取歌单里的歌曲信息
  currentSongList.value = [] // 清空之前的列表
  for (const item of result.data) {
    // 获取单里的歌曲
    const resultSong = await HttpManager.getSongOfId(item.songId)
    if (resultSong.data && resultSong.data[0]) {
      currentSongList.value.push(resultSong.data[0])
    }
  }
}
// 获取评分
async function getRank(id: string) {
  const result = await HttpManager.getRankOfSongListId(id)
  nowRank.value = (result.data || 0) / 2
}
async function getUserRank(userId: string, songListIdParam: string) {
  const result = await HttpManager.getUserRank(userId, songListIdParam)
  nowScore.value = result.data / 2
  disabledRank.value = true
  assistText.value = '已评价'
}
// 提交评分
async function pushValue() {
  if (disabledRank.value || !checkStatus())
    return

  const songListIdParam = nowSongListId.value
  const consumerId = nowUserId.value
  const scoreParam = nowScore.value * 2
  try {
    const result = await HttpManager.setRank({ songListId: songListIdParam, consumerId, score: scoreParam })
    ElMessage({
      message: result.message,
      type: result.type,
    })

    if (result.success) {
      getRank(nowSongListId.value)
      disabledRank.value = true
      assistText.value = '已评价'
    }
  }
  catch (error) {
    console.error(error)
  }
}

// Execute async operations after component setup
setTimeout(() => {
  if (nowUserId.value && nowSongListId.value) {
    getUserRank(nowUserId.value, nowSongListId.value)
    getRank(nowSongListId.value) // 获取评分
    getSongId(nowSongListId.value) // 获取歌单里面的歌曲ID
  }
}, 0)
</script>

<template>
  <el-container>
    <el-aside class="album-slide">
      <el-image class="album-img" fit="contain" :src="attachImageUrl(songDetails.pic)" />
      <h3 class="album-info">
        {{ songDetails.title }}
      </h3>
    </el-aside>
    <el-main class="album-main">
      <h1>简介</h1>
      <p>{{ songDetails.introduction }}</p>
      <!-- 评分 -->
      <div class="album-score">
        <div>
          <h3>歌单评分</h3>
          <el-rate v-model="rank" allow-half disabled />
        </div>
        <span>{{ rank * 2 }}</span>
        <div>
          <h3>{{ assistText }} {{ score * 2 }}</h3>
          <el-rate v-model="score" allow-half :disabled="disabledRank" @click="pushValue()" />
        </div>
      </div>
      <!-- 歌曲 -->
      <SongList class="album-body" :song-list="currentSongList" />
      <Comment :play-id="songListId" :type="1" />
    </el-main>
  </el-container>
</template>

<style lang="scss" scoped>
@import "@/assets/css/var.scss";

.album-slide {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;

  .album-img {
    height: 250px;
    width: 250px;
    border-radius: 10%;
  }

  .album-info {
    width: 70%;
    padding-top: 2rem;
  }
}

.album-main {
  h1 {
    font-size: 22px;
  }

  p {
    color: rgba(0, 0, 0, 0.5);
    margin: 10px 0 20px 0px;
  }
  /*歌单打分*/
  .album-score {
    display: flex;
    align-items: center;
    margin: 1vw;

    h3 {
      margin: 10px 0;
    }
    span {
      font-size: 60px;
    }
    & > div:last-child {
      margin-left: 10%;
    }
  }

  .album-body {
    margin: 20px 0 20px 0px;
  }
}

@media screen and (min-width: $sm) {
  .album-slide {
    position: fixed;
    width: 400px;
  }
  .album-main {
    min-width: 600px;
    padding-right: 10vw;
    margin-left: 400px;
  }
}

@media screen and (max-width: $sm) {
  .album-slide {
    display: none;
  }
}
</style>

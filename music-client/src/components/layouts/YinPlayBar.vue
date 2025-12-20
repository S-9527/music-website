<script lang="ts" setup>
import { ref } from 'vue'
import { useApp } from '@/composables/useApp'
import { usePlayerBar } from '@/composables/usePlayerBar'
import YinIcon from './YinIcon.vue'

// Use the player bar composable to get all state and functions
const {
  // Reactive state
  isCollection,
  startTime,
  endTime,
  nowTime,
  volume,
  playStateList,
  playStateIndex,
  iconList,

  songId,
  playBtnIcon,
  songUrl,
  songTitle,
  singerName,
  songPic,
  attachImageUrl,

  changeCollection,
  changeAside,
  togglePlay,
  changeTime,
  changePlayState,
  prev,
  next,
  goPlayerPage,
} = usePlayerBar()

// Get downloadMusic function from useApp composable
const { downloadMusic } = useApp()

// Additional local state
const toggle = ref(true)
</script>

<template>
  <div class="play-bar" :class="{ show: !toggle }">
    <div class="fold" :class="{ turn: toggle }">
      <YinIcon :icon="iconList.FOLD" @click="toggle = !toggle" />
    </div>
    <!-- 播放进度 -->
    <el-slider v-model="nowTime" class="progress" size="small" @change="changeTime" />
    <div class="control-box">
      <div class="info-box">
        <!-- 歌曲图片 -->
        <div @click="goPlayerPage">
          <el-image class="song-bar-img" fit="contain" :src="attachImageUrl(songPic)" />
        </div>
        <!-- 播放开始结束时间 -->
        <div v-if="songId">
          <div class="song-info">
            {{ songTitle }} - {{ singerName }}
          </div>
          <div class="time-info">
            {{ startTime }} / {{ endTime }}
          </div>
        </div>
      </div>
      <div class="song-ctr">
        <YinIcon class="yin-play-show" :icon="playStateList[playStateIndex]" @click="changePlayState" />
        <!-- 上一首 -->
        <YinIcon class="yin-play-show" :icon="iconList.PREV" @click="prev" />
        <!-- 播放 -->
        <YinIcon :icon="playBtnIcon" @click="togglePlay" />
        <!-- 下一首 -->
        <YinIcon class="yin-play-show" :icon="iconList.NEXT" @click="next" />
        <!-- 音量 -->
        <el-dropdown class="yin-play-show" trigger="click">
          <YinIcon v-if="volume !== 0" :icon="iconList.VOLUME" />
          <YinIcon v-else :icon="iconList.MUTE" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-slider
                v-model="volume" class="yin-slider" style="height: 150px; margin: 10px 0"
                :vertical="true"
              />
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="song-ctr song-edit">
        <!-- 收藏 -->
        <YinIcon
          class="yin-play-show"
          :class="{ active: isCollection }"
          :icon="isCollection ? iconList.like : iconList.dislike"
          @click="changeCollection"
        />
        <!-- 下载 -->
        <YinIcon
          class="yin-play-show"
          :icon="iconList.download"
          @click="
            downloadMusic({
              songUrl,
              songName: `${singerName}-${songTitle}`,
            })
          "
        />
        <!-- 歌曲列表 -->
        <YinIcon :icon="iconList.LIST" @click="changeAside" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/css/yin-play-bar.scss";
</style>

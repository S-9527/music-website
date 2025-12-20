<script lang="ts" setup>
import { computed, nextTick, ref, watch } from 'vue'
import { HttpManager } from '@/api'
import { useSongStore } from '@/store'

const songStore = useSongStore()
const audioRef = ref<HTMLAudioElement>()

function setAudioRef(el: any) {
  if (el) {
    audioRef.value = el as HTMLAudioElement
  }
}

const songUrl = computed(() => songStore.songUrl) // 音乐链接
const isPlay = computed(() => songStore.isPlay) // 播放状态
const volume = computed(() => songStore.volume) // 音量
const changeTime = computed(() => songStore.changeTime) // 指定播放时刻
const autoNext = computed(() => songStore.autoNext) // 用于触发自动播放下一首

// 监听播放还是暂停
watch(
  isPlay,
  (newVal) => {
    if (audioRef.value) {
      if (newVal) {
        // 尝试播放
        const playPromise = audioRef.value.play()
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // 播放成功
            })
            .catch((error) => {
              console.error('播放失败:', error)
              // 如果播放失败，可能是因为浏览器的自动播放策略，需要用户交互
              songStore.setIsPlay(false)
            })
        }
      }
      else {
        audioRef.value.pause()
      }
    }
  },
  { immediate: true },
)

// 监听音量变化
watch(
  volume,
  (newVolume) => {
    if (audioRef.value) {
      audioRef.value.volume = newVolume
    }
  },
  { immediate: true },
)

// 跳转到指定时间
watch(
  changeTime,
  (newTime) => {
    if (audioRef.value && !Number.isNaN(newTime)) {
      audioRef.value.currentTime = newTime
    }
  },
  { immediate: true },
)

// 监听歌曲URL变化，确保音频正确加载和播放
watch(
  songUrl,
  async (newUrl) => {
    if (newUrl && audioRef.value) {
      // 等待DOM更新后再操作音频元素
      await nextTick()
      // 如果有新的歌曲URL，则重置播放状态
      songStore.setIsPlay(false)
      // 延迟一点再设置为播放状态，让音频有时间加载
      setTimeout(() => {
        if (audioRef.value) {
          songStore.setIsPlay(true)
        }
      }, 100)
    }
  },
  { immediate: false },
)

// 获取歌曲链接后准备播放
function canplay() {
  if (audioRef.value) {
    // 记录音乐时长
    songStore.setDuration(audioRef.value.duration)

    // 如果设置了播放状态为true，才真正开始播放
    if (isPlay.value) {
      const playPromise = audioRef.value.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error('音频播放失败:', error)
          // 如果播放失败，重置播放状态
          songStore.setIsPlay(false)
        })
      }
    }
  }
}

// 音乐播放时记录音乐的播放位置
function timeupdate() {
  if (audioRef.value) {
    songStore.setCurTime(audioRef.value.currentTime)
  }
}

// 音乐播放结束时触发
function ended() {
  songStore.setIsPlay(false)
  songStore.setCurTime(0)
  songStore.setAutoNext(!autoNext.value)
}

const attachImageUrl = HttpManager.attachImageUrl
</script>

<template>
  <audio :ref="setAudioRef" :src="attachImageUrl(songUrl)" controls="controls" preload="metadata" @canplay="canplay" @timeupdate="timeupdate" @ended="ended">
    <!-- （1）属性：controls，preload（2）事件：canplay，timeupdate，ended（3）方法：play()，pause() -->
    <!-- controls：向用户显示音频控件（播放/暂停/进度条/音量） -->
    <!-- preload：属性规定是否在页面加载后载入音频 -->
    <!-- canplay：当音频/视频处于加载过程中时，会发生的事件 -->
    <!-- timeupdate：当目前的播放位置已更改时 -->
    <!-- ended：当目前的播放列表已结束时 -->
  </audio>
</template>

<style scoped>
audio {
  display: none;
}
</style>

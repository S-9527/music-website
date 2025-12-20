<script lang="ts" setup>
import type { ComputedRef } from 'vue'
import type { Song } from '@/types'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { HttpManager } from '@/api'
import Comment from '@/components/Comment.vue'
import { useSongStore } from '@/store'
import { parseLyric } from '@/utils'

const songStore = useSongStore()

// Define attachImageUrl for use in template
const attachImageUrl = HttpManager.attachImageUrl

// Reactive state
const lrcTop = ref('80px') // 歌词滑动
const lyricArr = ref<Array<[number, string]>>([]) // 当前歌曲的歌词 [time, text]

// Store getters
const songId = computed(() => songStore.songId) // 歌曲ID
const lyric = computed(() => songStore.lyric) // 歌词 (this is already parsed)
const currentPlayList = computed(() => songStore.currentPlayList) as ComputedRef<Song[]> // 存放的音乐
const currentPlayIndex = computed(() => songStore.currentPlayIndex) // 当前歌曲在歌曲列表的位置
const curTime = computed(() => songStore.curTime)
const songTitle = computed(() => songStore.songTitle) // 歌名
const singerName = computed(() => songStore.singerName) // 歌手名
const songPic = computed(() => songStore.songPic) // 歌曲图片

// Update lyrics when song changes
watch(songId, () => {
  if (currentPlayList.value && currentPlayIndex.value >= 0) {
    const currentSong = currentPlayList.value[currentPlayIndex.value]
    if (currentSong && currentSong.lyric) {
      // If lyric is a string, parse it; otherwise use it directly
      lyricArr.value = typeof currentSong.lyric === 'string' ? parseLyric(currentSong.lyric) : currentSong.lyric
    }
    else {
      lyricArr.value = []
    }
  }
})

// Update lyric display when time changes
watch(curTime, updateLyricDisplay)

// Initialize lyrics
onMounted(() => {
  if (lyric.value) {
    // lyric.value should be a string, so we parse it to get the array
    lyricArr.value = typeof lyric.value === 'string' ? parseLyric(lyric.value) : lyric.value
  }
})

// Clean up on component unmount
onUnmounted(() => {
  // Reset any DOM manipulations if needed
})

// Function to update lyric display based on current time
function updateLyricDisplay() {
  if (lyricArr.value.length === 0)
    return

  // Find the current lyric line based on time
  let currentIndex = -1
  for (let i = 0; i < lyricArr.value.length; i++) {
    const lyricTime = lyricArr.value[i][0]
    if (curTime.value >= lyricTime) {
      currentIndex = i
    }
    else {
      break
    }
  }

  if (currentIndex >= 0) {
    // Reset all lyric elements to default style
    const lyricElements = document.querySelectorAll('.has-lyric li') as NodeListOf<HTMLElement>
    for (let i = 0; i < lyricElements.length; i++) {
      const element = lyricElements[i]
      if (element) {
        element.style.color = '#000'
        element.style.fontSize = '14px'
      }
    }

    // Highlight the current lyric line
    if (lyricElements[currentIndex]) {
      const currentElement = lyricElements[currentIndex]
      currentElement.style.color = '#95d2f6'
      currentElement.style.fontSize = '18px'
    }

    // Update the scroll position
    lrcTop.value = `${-currentIndex * 30 + 50}px`
  }
}
</script>

<template>
  <div class="song-container">
    <el-image class="song-pic" fit="contain" :src="attachImageUrl(songPic)" />
    <ul class="song-info">
      <li>歌手：{{ singerName }}</li>
      <li>歌曲：{{ songTitle }}</li>
    </ul>
  </div>
  <div class="container">
    <div class="lyric-container">
      <div class="song-lyric">
        <transition-group name="lyric-fade">
          <!-- 有歌词 -->
          <ul v-if="lyricArr.length" key="has-lyric" :style="{ top: lrcTop }" class="has-lyric">
            <li v-for="(item, index) in lyricArr" :key="index">
              {{ item[1] }}
            </li>
          </ul>
          <!-- 没歌词 -->
          <div v-else key="no-lyric" class="no-lyric">
            <span>暂无歌词</span>
          </div>
        </transition-group>
      </div>
      <Comment :play-id="songId" :type="0" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/css/var.scss";

.song-container {
  position: fixed;
  top: 120px;
  left: 50px;
  display: flex;
  flex-direction: column;

  .song-pic {
    height: 300px;
    width: 300px;
    border: 4px solid white;
    border-radius: 12px;
  }

  .song-info {
    width: 300px;
    li {
      width: 100%;
      line-height: 40px;
      font-size: 18px;
      padding-left: 10%;
    }
  }
}

.lyric-container {
  font-family: $font-family;
  .song-lyric {
    position: relative;
    min-height: 300px;
    padding: 30px 0;
    overflow: auto;
    border-radius: 12px;
    background-color: $color-light-grey;
    display: flex;
    justify-content: center;
    .has-lyric {
      position: absolute;
      transition: all 1s;
      li {
        width: 100%;
        height: 40px;
        text-align: center;
        font-size: 14px;
        line-height: 40px;
      }
    }
    .no-lyric {
      position: absolute;
      margin: 100px 0;

      span {
        font-size: 18px;
        text-align: center;
      }
    }
  }
}

.lyric-fade-enter,
.lyric-fade-leave-to {
  transform: translateX(30px);
  opacity: 0;
}

.lyric-fade-enter-active,
.lyric-fade-leave-active {
  transition: all 0.3s ease;
}

@media screen and (min-width: $sm) {
  .container {
    padding-top: 30px;
  }
  .lyric-container {
    margin: 0 150px 0px 400px;
  }
}

@media screen and (max-width: $sm) {
  .container {
    padding: 20px;
  }
  .song-container {
    display: none;
  }
}
</style>

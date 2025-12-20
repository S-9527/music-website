<script lang="ts" setup>
import { toRefs } from 'vue'
import { HttpManager } from '@/api'
import YinIcon from '@/components/layouts/YinIcon.vue'
import { useGoto } from '@/composables/goto'
import { Icon } from '@/enums'
import { useSongStore } from '@/store'

interface Props {
  title?: string
  playList?: any[]
  path?: string
}

const props = withDefaults(defineProps<Props>(), {
  playList: () => [],
})

const { gotoSongSheetDetail, gotoSingerDetail } = useGoto()
const songStore = useSongStore()

const { path } = toRefs(props)

function goAlbum(item: any) {
  songStore.setSongDetails(item)
  // Determine which navigation function to use based on the path
  if (path.value === 'song-sheet-detail') {
    gotoSongSheetDetail(item.id)
  }
  else if (path.value === 'singer-detail') {
    gotoSingerDetail(item.id)
  }
}

const attachImageUrl = HttpManager.attachImageUrl

// Define PLAY for use in template
const PLAY = Icon.PLAY
</script>

<template>
  <div class="play-list">
    <div v-if="title" class="play-title">
      {{ title }}
    </div>
    <ul class="play-body">
      <li v-for="(item, index) in playList" :key="index" class="card-frame">
        <div class="card" @click="goAlbum(item)">
          <el-image class="card-img" fit="contain" :src="attachImageUrl(item.pic)" />
          <div class="mask" @click="goAlbum(item)">
            <YinIcon class="mask-icon" :icon="PLAY" />
          </div>
        </div>
        <p class="card-name">
          {{ item.name || item.title }}
        </p>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/css/var.scss";
@import "@/assets/css/global.scss";

.play-list {
  padding: 0 1rem;

  .play-title {
    height: 60px;
    line-height: 60px;
    font-size: 28px;
    font-weight: 500;
    text-align: center;
    color: $color-black;
    box-sizing: border-box;
  }

  .play-body {
    @include layout(flex-start, stretch, row, wrap);
  }
}

.card-frame {
  .card {
    position: relative;
    height: 0;
    padding-bottom: 100%;
    overflow: hidden;
    border-radius: 5px;

    .card-img {
      width: 100%;
      transition: all 0.4s ease;
    }
  }

  .card-name {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    margin: 0.5rem 0;
  }

  &:hover .card-img {
    transform: scale(1.2);
  }
}

.mask {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 5px;
  background-color: rgba(52, 47, 41, 0.4);
  @include layout(center, center);
  transition: all 0.3s ease-in-out;
  opacity: 0;

  .mask-icon {
    @include icon(2em, rgba(240, 240, 240, 1));
  }

  &:hover {
    opacity: 1;
    cursor: pointer;
  }
}

@media screen and (min-width: $sm) {
  .card-frame {
    width: 18%;
    margin: 0.5rem 1%;
  }
}

@media screen and (max-width: $sm) {
  .card-frame {
    width: 46%;
    margin: 0.5rem 2%;
  }
}
</style>

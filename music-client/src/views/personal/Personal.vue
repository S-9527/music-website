<script lang="ts" setup>
import type { Song } from '@/types'
import { Edit } from '@element-plus/icons-vue'
import { computed, nextTick, ref, watch } from 'vue'
import { HttpManager } from '@/api'
import SongList from '@/components/SongList.vue'
import { useGoto } from '@/composables/goto'
import { useUserStore } from '@/store'
import Upload from '../setting/Upload.vue'

const userStore = useUserStore()

const { gotoSetting } = useGoto()

// Define attachImageUrl for use in template
const attachImageUrl = HttpManager.attachImageUrl

const dialogTableVisible = ref(false)
const collectSongList = ref<Song[]>([]) // 收藏的歌曲

const userId = computed(() => userStore.userId)
const userPic = computed(() => userStore.userPic)
const username = computed(() => userStore.username)
const introduction = computed(() => userStore.introduction)

watch(userPic, () => {
  dialogTableVisible.value = false
})

// 获取收藏的歌曲
async function getCollection(userId: string) {
  const result = await HttpManager.getCollectionOfUser(userId)
  const collectIDList = result.data || [] // 存放收藏的歌曲ID

  // 清空之前的收藏列表
  collectSongList.value = []

  // 通过歌曲ID获取歌曲信息
  for (const item of collectIDList) {
    if (!item.songId) {
      console.error(`歌曲${item}异常`)
      continue
    }

    const songResult = await HttpManager.getSongOfId(item.songId)
    if (songResult.data && songResult.data[0]) {
      collectSongList.value.push(songResult.data[0])
    }
  }
}

function changeData() {
  getCollection(userId.value)
}

nextTick(async () => {
  // Load user info from the store if not already loaded
  if (!userStore.userId) {
    // If user info is not in store, fetch it and update the store
    const result = await HttpManager.getUserOfId(userStore.userId)
    if (result.data && result.data[0]) {
      userStore.setUserInfo(result.data[0])
    }
  }
  await getCollection(userId.value)
})
</script>

<template>
  <div class="personal">
    <div class="personal-info">
      <div class="personal-img" @click="dialogTableVisible = true">
        <el-image fit="contain" :src="attachImageUrl(userPic)" />
      </div>
      <div class="personal-msg">
        <div class="username">
          {{ username }}
        </div>
        <div class="introduction">
          {{ introduction }}
        </div>
      </div>
      <el-button class="edit-info" round :icon="Edit" @click="gotoSetting()">
        修改个人信息
      </el-button>
    </div>
    <div class="personal-body">
      <SongList :song-list="collectSongList" :show="true" @change-data="changeData" />
    </div>
    <el-dialog v-model="dialogTableVisible" title="修改头像">
      <Upload />
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/css/var.scss";

.personal {
  padding-top: $header-height + 150px;

  &::before {
    content: "";
    background-color: $color-blue-shallow;
    position: absolute;
    top: 0;
    width: 100%;
    height: $header-height + 150px;
  }
}

.personal-info {
  position: relative;
  margin-bottom: 60px;
  .personal-img {
    height: 200px;
    width: 200px;
    border-radius: 50%;
    border: 5px solid $color-white;
    position: absolute;
    top: -180px;
    left: 50px;
    cursor: pointer;
  }
  .personal-msg {
    margin-left: 300px;
    position: absolute;
    top: -120px;

    .username {
      font-size: 50px;
      font-weight: 600;
    }

    .introduction {
      font-size: 20px;
      font-weight: 500;
    }
  }
  .edit-info {
    position: absolute;
    right: 10vw;
    margin-top: -120px;
  }
}

@media screen and (min-width: $sm) {
  .personal-body {
    padding: 0 100px;
  }
}

@media screen and (max-width: $sm) {
  .edit-info {
    display: none;
  }
}
</style>

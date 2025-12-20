<script lang="ts" setup>
import type { Song } from '@/types'
import { Delete, Download, MoreFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { computed, toRefs } from 'vue'
import { HttpManager } from '@/api'
import { useApp } from '@/composables/useApp'
import { useUserStore } from '@/store'

interface Props {
  songList?: Song[]
  show?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  songList: () => [],
  show: false,
})

const emit = defineEmits<{
  (e: 'changeData', data: any): void
}>()

const { getSongTitle, getSingerName, playMusic, checkStatus, downloadMusic } = useApp()
const userStore = useUserStore()

const { songList } = toRefs(props)

const dataList = computed(() => {
  const list: Song[] = []
  songList.value.forEach((item: Song, index: number) => {
    item.songName = getSongTitle(item.name)
    item.singerName = getSingerName(item.name)
    item.index = index
    list.push(item)
  })
  return list
})

function handleClick(row: Song) {
  playMusic({
    id: row.id,
    url: row.url,
    pic: row.pic,
    index: row.index || 0,
    name: row.name,
    lyric: row.lyric,
    currentSongList: songList.value,
  })
}

function handleEdit(_row: Song) {
  return _row
}

/**
 * 删除收藏
 * @param id
 */
async function deleteCollection({ id }: { id: string }) {
  if (!checkStatus()) {
    return
  }

  const result = await HttpManager.deleteCollection(userStore.userId, id)
  ElMessage({
    message: result.message,
    type: result.type,
  })

  if (result.success) {
    emit('changeData', result.data)
  }
}
</script>

<template>
  <div class="content">
    <el-table highlight-current-row :data="dataList" @row-click="handleClick">
      <el-table-column prop="songName" label="歌曲" />
      <el-table-column prop="singerName" label="歌手" />
      <el-table-column prop="introduction" label="专辑" />
      <el-table-column label="编辑" width="80" align="center">
        <template #default="scope">
          <el-dropdown>
            <el-icon @click="handleEdit(scope.row)">
              <MoreFilled />
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  :icon="Download"
                  @click="
                    downloadMusic({
                      songUrl: scope.row.url,
                      songName: scope.row.name,
                    })
                  "
                >
                  下载
                </el-dropdown-item>
                <el-dropdown-item v-if="show" :icon="Delete" @click="deleteCollection({ id: scope.row.id })">
                  删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/css/var.scss";
@import "@/assets/css/global.scss";

.content {
  background-color: $color-white;
  border-radius: $border-radius-songlist;
  padding: 10px;
}

.content:deep(.el-table__row.current-row) {
  color: $color-black;
  font-weight: bold;
}

.content:deep(.el-table__row) {
  cursor: pointer;
}

.icon {
  @include icon(1.2em, $color-black);
}
</style>

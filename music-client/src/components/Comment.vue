<script lang="ts" setup>
import type { Comment } from '@/types'
import { Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { computed, onMounted, reactive, ref, toRefs, watch } from 'vue'
import { HttpManager } from '@/api'
import YinIcon from '@/components/layouts/YinIcon.vue'
import { useApp } from '@/composables/useApp'
import { Icon } from '@/enums'
import { useSongStore, useUserStore } from '@/store'
import { formatDate } from '@/utils'

// Define props interface
interface Props {
  playId?: number | string // 歌曲ID 或 歌单ID
  type: number // 歌单 1 / 歌曲 0
}

// Define props with defaults
const props = withDefaults(defineProps<Props>(), {
  playId: 0,
})

// Composables and stores
const { checkStatus } = useApp()
const userStore = useUserStore()
const songStore = useSongStore()

// Destructure props
const { playId, type } = toRefs(props)

// Reactive state
const textarea = ref('') // 存放输入内容
const commentList = ref<Comment[]>([]) // 存放评论内容
const loading = ref(false) // Loading state for API calls
const iconList = reactive({
  Support: Icon.SUPPORT,
})

// Computed properties
const currentUserId = computed(() => userStore.userId)
const currentSongId = computed(() => songStore.songId)

// Watch for songId changes
watch(currentSongId, (newSongId) => {
  if (newSongId) {
    getComment(newSongId.toString())
  }
})

// Lifecycle hooks
onMounted(() => {
  getComment(playId.value.toString())
})

// API methods
async function getComment(id: string | number) {
  if (loading.value)
    return // Prevent duplicate requests

  loading.value = true
  try {
    const result = await HttpManager.getAllComment(type.value, id.toString())
    commentList.value = result.data || []

    // Fetch user info for each comment
    for (const comment of commentList.value) {
      try {
        const userResult = await HttpManager.getUserOfId(comment.userId.toString())
        const user = userResult.data?.[0]
        if (user) {
          comment.avator = user.avator
          comment.username = user.username
        }
      }
      catch (userError) {
        console.error(`[获取用户信息失败] 用户ID: ${comment.userId}`, userError)
      }
    }
  }
  catch (error) {
    console.error('[获取评论失败]===>', error)
    ElMessage({
      message: '获取评论失败',
      type: 'error',
    })
  }
  finally {
    loading.value = false
  }
}

// Submit new comment
async function submitComment() {
  if (!checkStatus())
    return

  const content = textarea.value.trim()
  if (!content) {
    ElMessage({
      message: '评论内容不能为空',
      type: 'warning',
    })
    return
  }

  // 0 代表歌曲， 1 代表歌单
  const commentData = {
    userId: currentUserId.value,
    content,
    songId: type.value === 0 ? playId.value.toString() : undefined,
    songListId: type.value === 1 ? playId.value.toString() : undefined,
    nowType: type.value,
  }

  try {
    const result = await HttpManager.setComment(commentData)
    ElMessage({
      message: result.message,
      type: result.type,
    })

    if (result.success) {
      textarea.value = ''
      await getComment(playId.value.toString())
    }
  }
  catch (error) {
    console.error('[提交评论失败]===>', error)
    ElMessage({
      message: '提交评论失败',
      type: 'error',
    })
  }
}

// Delete a comment
async function deleteComment(commentId: number, index: number) {
  try {
    const result = await HttpManager.deleteComment(commentId)
    ElMessage({
      message: result.message,
      type: result.type,
    })

    if (result.success) {
      commentList.value.splice(index, 1)
    }
  }
  catch (error) {
    console.error('[删除评论失败]===>', error)
    ElMessage({
      message: '删除评论失败',
      type: 'error',
    })
  }
}

// Toggle comment support (like/unlike)
async function toggleSupport(commentId: number, currentUp: number, userId: string) {
  if (!checkStatus())
    return

  try {
    // Check if user already supported this comment
    const supportCheck = await HttpManager.testAlreadySupport({ commentId, userId })

    let newUpCount = currentUp
    let operationResult

    if (supportCheck.data) {
      // User already supported, so remove support
      operationResult = await HttpManager.deleteUserSupport({ commentId, userId })
      newUpCount = currentUp - 1
    }
    else {
      // User hasn't supported yet, so add support
      operationResult = await HttpManager.insertUserSupport({ commentId, userId })
      newUpCount = currentUp + 1
    }

    // Update the like count
    const updateResult = await HttpManager.setSupport({ id: commentId, up: newUpCount })

    if (updateResult.success && operationResult.success) {
      await getComment(playId.value.toString())
      ElMessage({
        message: supportCheck.data ? '已取消点赞' : '点赞成功',
        type: 'success',
      })
    }
    else {
      ElMessage({
        message: '操作失败',
        type: 'error',
      })
    }
  }
  catch (error) {
    console.error('[点赞操作失败]===>', error)
    ElMessage({
      message: '点赞操作失败',
      type: 'error',
    })
  }
}

// Utility functions
const attachImageUrl = HttpManager.attachImageUrl
</script>

<template>
  <div class="comment">
    <h2 class="comment-title">
      <span>评论</span>
      <span class="comment-desc">共 {{ commentList.length }} 条评论</span>
    </h2>
    <el-input v-model="textarea" class="comment-input" type="textarea" placeholder="期待您的精彩评论..." :rows="2" />
    <el-button class="sub-btn" type="primary" @click="submitComment()">
      发表评论
    </el-button>
  </div>
  <ul class="popular">
    <li v-for="(item, index) in commentList" :key="index">
      <el-image class="popular-img" fit="contain" :src="attachImageUrl(item.avator || '')" />
      <div class="popular-msg">
        <ul>
          <li class="name">
            {{ item.username }}
          </li>
          <li class="time">
            {{ formatDate(item.createTime) }}
          </li>
          <li class="content">
            {{ item.content }}
          </li>
        </ul>
      </div>
      <!-- 这特么是直接拿到了评论的id -->
      <div class="comment-ctr" @click="toggleSupport(item.id, item.up, currentUserId)">
        <div><YinIcon :icon="iconList.Support" /> {{ item.up }}</div>
        <el-icon v-if="item.userId.toString() === currentUserId" @click="deleteComment(item.id, index)">
          <Delete />
        </el-icon>
      </div>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
@import "@/assets/css/var.scss";
@import "@/assets/css/global.scss";

/*评论*/
.comment {
  position: relative;
  margin-bottom: 60px;

  .comment-title {
    height: 50px;
    line-height: 50px;

    .comment-desc {
      font-size: 14px;
      font-weight: 400;
      color: $color-grey;
      margin-left: 10px;
    }
  }

  .comment-input {
    display: flex;
    margin-bottom: 20px;
  }

  .sub-btn {
    position: absolute;
    right: 0;
  }
}

/*热门评论*/
.popular {
  width: 100%;
  > li {
    border-bottom: solid 1px rgba(0, 0, 0, 0.1);
    padding: 15px 0;
    display: flex;
    .popular-img {
      width: 50px;
    }

    .popular-msg {
      padding: 0 20px;
      flex: 1;
      li {
        width: 100%;
      }
      .time {
        font-size: 0.6rem;
        color: rgba(0, 0, 0, 0.5);
      }
      .name {
        color: rgba(0, 0, 0, 0.5);
      }
      .content {
        font-size: 1rem;
      }
    }

    .comment-ctr {
      display: flex;
      align-items: center;
      width: 80px;
      font-size: 1rem;
      cursor: pointer;

      .el-icon {
        margin: 0 10px;
      }

      &:hover,
      :deep(.icon):hover {
        color: $color-grey;
      }
    }
  }
}

.icon {
  @include icon(1em);
}
</style>

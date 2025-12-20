<script lang="ts" setup>
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { computed, ref } from 'vue'
import { HttpManager } from '@/api'
import { useUserStore } from '@/store'

const userStore = useUserStore()

const uploadTypes = ref(['jpg', 'jpeg', 'png', 'gif'])
const userId = computed(() => userStore.userId)

function uploadUrl() {
  return HttpManager.uploadUrl(userId.value)
}

function beforeAvatarUpload(file: File) {
  const ltCode = 2
  const isLt10M = file.size / 1024 / 1024
  const isExistFileType = uploadTypes.value.includes(file.type.replace(/image\//, ''))

  if (isLt10M > ltCode || isLt10M <= 0) {
    ElMessage.error(`图片大小范围是 0~${ltCode}MB!`)
    return false
  }
  if (!isExistFileType) {
    ElMessage.error(`图片只支持 ${uploadTypes.value.join('、')} 格式!`)
    return false
  }

  return isLt10M && isExistFileType
}

function handleAvatarSuccess(response: any, _file: any) {
  ElMessage({
    message: response.message,
    type: response.type,
  })

  if (response.success)
    userStore.setUserPic(response.data)
}
</script>

<template>
  <div class="upload">
    <el-upload drag :action="uploadUrl()" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
      <el-icon class="el-icon--upload">
        <UploadFilled />
      </el-icon>
      <div class="el-upload__text">
        将文件拖到此处或点击上传
      </div>
      <template #tip>
        <p class="el-upload__tip">
          只能上传 {{ uploadTypes.join("、") }} 文件, 且不超过10M
        </p>
      </template>
    </el-upload>
  </div>
</template>

<style scoped>
.upload {
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

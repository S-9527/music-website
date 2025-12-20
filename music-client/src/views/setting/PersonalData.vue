<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import { HttpManager } from '@/api'
import { useApp } from '@/composables/useApp'
import { AREA, SignUpRules } from '@/enums'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const { goBack } = useApp()

// 注册
const registerForm = reactive({
  username: '',
  sex: 2,
  phoneNum: '',
  email: '',
  birth: new Date(),
  introduction: '',
  location: '',
  userPic: '',
})

// Template ref for form validation
const updateFormRef = ref<FormInstance>()

async function loadUserInfo() {
  // User info should already be in the store, so just populate the form
  if (userStore.userId) {
    registerForm.username = userStore.username || ''
    registerForm.sex = userStore.userSex || 2
    registerForm.phoneNum = userStore.phoneNum || ''
    registerForm.email = userStore.email || ''
    registerForm.birth = userStore.birth ? new Date(userStore.birth) : new Date()
    registerForm.introduction = userStore.introduction || ''
    registerForm.location = userStore.location || ''
    registerForm.userPic = userStore.userPic || ''
  }
  else {
    // If not in store, fetch it
    const result = await HttpManager.getUserOfId(userStore.userId)
    if (result.data && result.data[0]) {
      userStore.setUserInfo(result.data[0])
      loadUserInfo() // Reload form with stored data
    }
  }
}

async function saveMsg() {
  let canRun = true
  if (updateFormRef.value) {
    await updateFormRef.value.validate((valid) => {
      if (!valid)
        canRun = false
    })
  }

  if (!canRun)
    return

  const id = userStore.userId
  const username = registerForm.username
  const sex = registerForm.sex
  const phoneNum = registerForm.phoneNum
  const email = registerForm.email
  const birth = registerForm.birth.toISOString().substring(0, 10)
  const introduction = registerForm.introduction
  const location = registerForm.location
  const result = await HttpManager.updateUserMsg({
    id,
    username,
    sex: sex || 2,
    phoneNum: phoneNum || '',
    email: email || '',
    birth: birth || '',
    introduction: introduction || '',
    location: location || '',
  })
  ElMessage({
    message: result.message,
    type: result.type,
  })
  if (result.success) {
    // Update the store with new values
    userStore.setUserInfo({
      id: userStore.userId,
      username: registerForm.username,
      avator: userStore.userPic,
      sex: registerForm.sex,
      birth: registerForm.birth.toISOString().substring(0, 10),
      location: registerForm.location,
      introduction: registerForm.introduction,
      phoneNum: registerForm.phoneNum,
      email: registerForm.email,
    })
    goBack(-1)
  }
}

onMounted(() => {
  loadUserInfo()
})
</script>

<template>
  <el-form ref="updateFormRef" label-width="70px" :model="registerForm" :rules="SignUpRules">
    <el-form-item prop="username" label="用户名">
      <el-input v-model="registerForm.username" placeholder="用户名" />
    </el-form-item>
    <el-form-item label="性别">
      <el-radio-group v-model="registerForm.sex">
        <el-radio :value="0">
          女
        </el-radio>
        <el-radio :value="1">
          男
        </el-radio>
        <el-radio :value="2">
          保密
        </el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item prop="birth" label="生日">
      <el-date-picker v-model="registerForm.birth" type="date" placeholder="选择日期" style="width: 100%" />
    </el-form-item>
    <el-form-item prop="introduction" label="签名">
      <el-input v-model="registerForm.introduction" type="textarea" placeholder="签名" />
    </el-form-item>
    <el-form-item prop="location" label="地区">
      <el-select v-model="registerForm.location" placeholder="地区" style="width: 100%">
        <el-option v-for="item in AREA" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item prop="phoneNum" label="手机">
      <el-input v-model="registerForm.phoneNum" placeholder="手机" />
    </el-form-item>
    <el-form-item prop="email" label="邮箱">
      <el-input v-model="registerForm.email" placeholder="邮箱" />
    </el-form-item>
    <el-form-item>
      <el-button @click="goBack(-1)">
        取消
      </el-button>
      <el-button type="primary" @click="saveMsg()">
        保存
      </el-button>
    </el-form-item>
  </el-form>
</template>

<style lang="scss" scoped>
.btn ::v-deep .el-form-item__content {
  display: flex;
  justify-content: center;
}
</style>

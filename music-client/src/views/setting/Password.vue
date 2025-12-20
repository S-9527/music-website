<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { computed, reactive, ref } from 'vue'
import { HttpManager } from '@/api'
import { useApp } from '@/composables/useApp'
import { validatePassword } from '@/enums'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const { goBack } = useApp()

// Template ref for form validation
const passwordFormRef = ref<FormInstance>()

const form = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})
const userId = computed(() => userStore.getUserId)
const userName = computed(() => userStore.getUsername)

function validateCheck(rule: any, value: any, callback: any) {
  if (value === '') {
    callback(new Error('密码不能为空'))
  }
  else if (value !== form.newPassword) {
    callback(new Error('请输入正确密码'))
  }
  else {
    callback()
  }
}
const rules = reactive({
  oldPassword: [{ validator: validatePassword, trigger: 'blur', min: 3 }],
  newPassword: [{ validator: validatePassword, trigger: 'blur', min: 3 }],
  confirmPassword: [{ validator: validateCheck, trigger: 'blur', min: 3 }],
})

async function clearData() {
  form.oldPassword = ''
  form.newPassword = ''
  form.confirmPassword = ''
}

async function confirm() {
  let canRun = true
  if (passwordFormRef.value) {
    await passwordFormRef.value.validate((valid) => {
      if (!valid)
        canRun = false
    })
  }
  if (!canRun)
    return

  const id = userId.value
  const username = userName.value
  const oldPassword = form.oldPassword
  const password = form.newPassword

  const result = await HttpManager.updateUserPassword({ id, username, oldPassword, password })
  ElMessage({
    message: result.message,
    type: result.type,
  })
  if (result.success)
    goBack()
}
</script>

<template>
  <el-form ref="passwordFormRef" label-width="70px" :model="form" :rules="rules">
    <el-form-item label="旧密码" prop="oldPassword">
      <el-input v-model="form.oldPassword" type="password" />
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input v-model="form.newPassword" type="password" />
    </el-form-item>
    <el-form-item label="密码确认" prop="confirmPassword">
      <el-input v-model="form.confirmPassword" type="password" />
    </el-form-item>
    <el-form-item>
      <el-button @click="clearData()">
        重置
      </el-button>
      <el-button type="primary" @click="confirm()">
        确认修改
      </el-button>
    </el-form-item>
  </el-form>
</template>

<style></style>

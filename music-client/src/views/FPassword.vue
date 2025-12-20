<script setup lang="ts">
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

const email = ref('')
const code = ref('')
const password = ref('')
const confirmPassword = ref('')

async function sendVerificationCode() {
  try {
    // Get values directly from the ref instead of using document.getElementById
    const response = await axios.get('http://localhost:8888/user/sendVerificationCode', ({ params: {
      email: email.value,
    } }))
    ElMessage({
      message: response.data,
      type: 'success',
    })
  }
  catch {
    ElMessage({
      message: '发送验证码失败',
      type: 'error',
    })
  }
}

async function handleSubmit() {
  if (password.value !== confirmPassword.value) {
    ElMessage({
      message: '两次输入的密码不一致',
      type: 'error',
    })
    return
  }

  try {
    const data = {
      email: email.value,
      code: code.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
    }
    const response = await axios.post('http://localhost:8888/user/resetPassword', data)
    ElMessage({
      message: response.data,
      type: 'success',
    })
  }
  catch {
    ElMessage({
      message: '重置密码失败',
      type: 'error',
    })
  }
}
</script>

<template>
  <el-container id="appSend">
    <el-header>
      <h1>修改密码</h1>
    </el-header>
    <el-main>
      <el-form @submit.prevent="handleSubmit">
        <el-form-item label="邮箱：" prop="email">
          <el-input id="email" v-model="email" type="email" required />
          <el-button @click="sendVerificationCode">
            发送验证码
          </el-button>
        </el-form-item>
        <el-form-item label="验证码：" prop="code">
          <el-input id="code" v-model="code" type="text" required />
        </el-form-item>
        <el-form-item label="新密码：" prop="password">
          <el-input id="password" v-model="password" type="password" required />
        </el-form-item>
        <el-form-item label="确认密码：" prop="confirmPassword">
          <el-input id="confirmPassword" v-model="confirmPassword" type="password" required />
        </el-form-item>
        <el-form-item>
          <el-button type="submit" @click="handleSubmit">
            提交
          </el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<style>
#appSend {
  max-width: 400px;
  margin: 0 auto;
}
</style>

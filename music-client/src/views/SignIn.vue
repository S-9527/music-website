<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
import { HttpManager } from '@/api'
import YinLoginLogo from '@/components/layouts/YinLoginLogo.vue'
import { useGoto } from '@/composables/goto'
import { useApp } from '@/composables/useApp'
import { NavName, SignInRules } from '@/enums'
import { useConfigureStore, useUserStore } from '@/store'

const userStore = useUserStore()
const configureStore = useConfigureStore()
const { changeIndex } = useApp()
const { gotoHome, gotoSignUp, gotoForgotPassword, gotoLoginByEmail } = useGoto()

// 登录用户名密码
const registerForm = reactive({
  username: '',
  password: '',
})

const signInForm = ref<FormInstance>()

async function handleLoginIn() {
  if (signInForm.value) {
    const valid = await signInForm.value.validate().catch(() => false)
    if (!valid) {
      return
    }
  }

  const username = registerForm.username
  const password = registerForm.password
  const result = await HttpManager.signIn(
    { username, password },
  )

  ElMessage({
    message: result.message,
    type: result.type,
  })

  if (result.success) {
    userStore.setUserId(result.data[0].id)
    userStore.setUsername(result.data[0].username)
    userStore.setUserPic(result.data[0].avator)
    configureStore.setToken(true)
    changeIndex(NavName.Home)
    gotoHome()
  }
}
</script>

<template>
  <YinLoginLogo />
  <div class="sign">
    <div class="sign-head">
      <span>帐号登录</span>
    </div>
    <el-form ref="signInForm" status-icon :model="registerForm" :rules="SignInRules">
      <el-form-item prop="username">
        <el-input v-model="registerForm.username" placeholder="用户名" />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="registerForm.password" type="password" placeholder="密码"
          @keyup.enter="handleLoginIn"
        />
      </el-form-item>
      <el-form-item class="sign-btn">
        <el-button @click="gotoSignUp">
          注册
        </el-button>
        <el-button type="primary" @click="handleLoginIn">
          登录
        </el-button>
        <el-button @click="gotoForgotPassword">
          忘记密码
        </el-button>
        <el-button @click="gotoLoginByEmail">
          邮箱登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/css/sign.scss";
</style>

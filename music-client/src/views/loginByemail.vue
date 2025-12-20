<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { ElForm, ElMessage } from 'element-plus'
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
const { gotoSignIn, gotoHome } = useGoto()

// 登录
const registerForm = reactive({
  email: '',
  password: '',
})

const signInForm = ref<FormInstance>()

async function handleLoginCancel() {
  gotoSignIn()
}

async function handleLoginIn() {
  let canRun = true
  if (signInForm.value) {
    signInForm.value.validate((valid) => {
      if (!valid)
        return (canRun = false)
    })
  }
  if (!canRun)
    return

  try {
    const email = registerForm.email
    const password = registerForm.password
    const result = (await HttpManager.signInByemail({ email, password })) as ResponseBody
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
  catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <YinLoginLogo />
  <div class="sign">
    <div class="sign-head">
      <span>邮箱登录</span>
    </div>
    <ElForm ref="signInForm" status-icon :model="registerForm" :rules="SignInRules">
      <el-form-item prop="email">
        <el-input v-model="registerForm.email" placeholder="邮箱" />
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="registerForm.password" type="password" placeholder="密码" @keyup.enter="handleLoginIn" />
      </el-form-item>
      <el-form-item class="sign-btn">
        <el-button type="primary" @click="handleLoginIn">
          登录
        </el-button>
        <el-button type="primary" @click="handleLoginCancel">
          取消
        </el-button>
      </el-form-item>
    </ElForm>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/css/sign.scss";
</style>

<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
import { HttpManager } from '@/api'
import YinLoginLogo from '@/components/layouts/YinLoginLogo.vue'
import { useGoto } from '@/composables/goto'
import { useApp } from '@/composables/useApp'
import { AREA, NavName, SignUpRules } from '@/enums'

const { changeIndex } = useApp()
const { gotoSignIn } = useGoto()

const signUpForm = ref<FormInstance>()

const registerForm = reactive({
  username: '',
  password: '',
  sex: '',
  phoneNum: '',
  email: '',
  birth: new Date(),
  introduction: '',
  location: '',
})

async function goBackRegister() {
  gotoSignIn()
}

async function handleSignUp() {
  let canRun = true
  if (signUpForm.value) {
    signUpForm.value.validate((valid) => {
      if (!valid)
        return (canRun = false)
    })
  }
  if (!canRun)
    return

  try {
    const username = registerForm.username
    const password = registerForm.password
    const sex = registerForm.sex
    const phoneNum = registerForm.phoneNum
    const email = registerForm.email
    const birth = registerForm.birth
    const introduction = registerForm.introduction
    const location = registerForm.location
    const result = await HttpManager.signUp({ username, password, sex, phoneNum, email, birth, introduction, location })
    ElMessage({
      message: result.message,
      type: result.type,
    })

    if (result.success) {
      changeIndex(NavName.SignIn)
      gotoSignIn()
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
      <span>用户注册</span>
    </div>
    <el-form ref="signUpForm" label-width="70px" status-icon :model="registerForm" :rules="SignUpRules">
      <el-form-item prop="username" label="用户名">
        <el-input v-model="registerForm.username" placeholder="用户名" />
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input v-model="registerForm.password" type="password" placeholder="密码" />
      </el-form-item>
      <el-form-item prop="sex" label="性别">
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
      <el-form-item prop="phoneNum" label="手机">
        <el-input v-model="registerForm.phoneNum" placeholder="手机" />
      </el-form-item>
      <el-form-item prop="email" label="邮箱">
        <el-input v-model="registerForm.email" placeholder="邮箱" />
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
      <el-form-item class="sign-btn">
        <el-button @click="goBackRegister()">
          取消
        </el-button>
        <el-button type="primary" @click="handleSignUp()">
          确定
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/css/sign.scss";
</style>

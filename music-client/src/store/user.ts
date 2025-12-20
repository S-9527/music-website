import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  // State
  const userId = ref('') // ID
  const username = ref('') // 名字
  const userPic = ref('') // 图片
  const userSex = ref<number>() // 性别
  const birth = ref<string>() // 生日
  const location = ref<string>() // 地区
  const introduction = ref<string>() // 介绍
  const phoneNum = ref<string>() // 手机
  const email = ref<string>() // 邢箱

  // Actions
  function setUserId(newUserId: string) {
    userId.value = newUserId
  }

  function setUsername(newUsername: string) {
    username.value = newUsername
  }

  function setUserPic(newUserPic: string) {
    userPic.value = newUserPic
  }

  function setUserSex(newSex: number) {
    userSex.value = newSex
  }

  function setBirth(newBirth: string) {
    birth.value = newBirth
  }

  function setLocation(newLocation: string) {
    location.value = newLocation
  }

  function setIntroduction(newIntroduction: string) {
    introduction.value = newIntroduction
  }

  function setPhoneNum(newPhoneNum: string) {
    phoneNum.value = newPhoneNum
  }

  function setEmail(newEmail: string) {
    email.value = newEmail
  }

  // Set all user info at once
  function setUserInfo(userInfo: {
    id: string
    username: string
    avator: string
    sex?: number
    birth?: string
    location?: string
    introduction?: string
    phoneNum?: string
    email?: string
  }) {
    setUserId(userInfo.id)
    setUsername(userInfo.username)
    setUserPic(userInfo.avator)
    if (userInfo.sex !== undefined)
      setUserSex(userInfo.sex)
    if (userInfo.birth !== undefined)
      setBirth(userInfo.birth)
    if (userInfo.location !== undefined)
      setLocation(userInfo.location)
    if (userInfo.introduction !== undefined)
      setIntroduction(userInfo.introduction)
    if (userInfo.phoneNum !== undefined)
      setPhoneNum(userInfo.phoneNum)
    if (userInfo.email !== undefined)
      setEmail(userInfo.email)
  }

  return {
    // State
    userId,
    username,
    userPic,
    userSex,
    birth,
    location,
    introduction,
    phoneNum,
    email,

    // Actions
    setUserId,
    setUsername,
    setUserPic,
    setUserSex,
    setBirth,
    setLocation,
    setIntroduction,
    setPhoneNum,
    setEmail,
    setUserInfo,
  }
})

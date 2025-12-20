import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConfigureStore = defineStore('configure', () => {
  // State
  const token = ref(false) // 用户是否登录
  const showAside = ref(false) // 是否显示侧边栏
  const searchWord = ref('') // 搜索关键词
  const activeNavName = ref('') // 导航栏名称

  // Actions
  function setToken(newToken: boolean) {
    token.value = newToken
  }

  function setActiveNavName(newActiveNavName: string) {
    activeNavName.value = newActiveNavName
  }

  function setShowAside(newShowAside: boolean) {
    showAside.value = newShowAside
  }

  function setSearchWord(newSearchWord: string) {
    searchWord.value = newSearchWord
  }

  return {
    // State
    token,
    showAside,
    searchWord,
    activeNavName,

    // Actions
    setToken,
    setActiveNavName,
    setShowAside,
    setSearchWord,
  }
})

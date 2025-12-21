import type { Song } from '@/types'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useConfigureStore, useSongStore } from '@/store'

export function useApp() {
  const router = useRouter()
  const configureStore = useConfigureStore()
  const songStore = useSongStore()
  const token = computed(() => configureStore.token)

  function getUserSex(sex: number): string {
    return sex === 0 ? '女' : '男'
  }

  // 获取歌曲名
  function getSongTitle(str: string): string {
    return str.split('-')[1] || str
  }

  // 获取歌手名
  function getSingerName(str: string): string {
    return str.split('-')[0] || str
  }

  // 判断登录状态
  function checkStatus(status: boolean = true) {
    if (!token.value) {
      if (status) {
        ElMessage({
          message: '请先登录',
          type: 'warning',
        })
      }
      return false
    }
    return true
  }

  // 播放
  function playMusic({ id, url, pic, index, name, lyric, currentSongList }: {
    id: string
    url: string
    pic: string
    index: number
    name: string
    lyric: any[]
    currentSongList: Song[]
  }) {
    const songTitle = getSongTitle(name)
    const singerName = getSingerName(name)
    songStore.playMusic({
      id,
      url,
      pic,
      index,
      songTitle,
      singerName,
      lyric,
      currentSongList,
    })
  }

  function getFileName(path: string): string {
    const parts = path.split('/')
    return parts[parts.length - 1] || ''
  }

  // 下载
  async function downloadMusic({ songUrl, songName }: { songUrl: string, songName: string }) {
    if (!songUrl) {
      ElMessage({
        message: '下载链接为空！',
        type: 'error',
      })
      console.error('下载链接为空！')
      return
    }
    const fileName = getFileName(songUrl)
    const downUrl = `/download/${fileName}`

    try {
      const response = await axios.get(downUrl, {
        responseType: 'blob', // 指定响应类型为二进制数据
      })

      // 创建一个Blob URL来下载文件
      const blob = new Blob([response.data], { type: 'application/octet-stream' })
      const url = window.URL.createObjectURL(blob)

      // 创建一个隐藏的<a>标签来下载文件
      const link = document.createElement('a')
      link.href = url
      link.download = songName
      document.body.appendChild(link)
      link.click()

      // 释放URL对象
      window.URL.revokeObjectURL(url)
      document.body.removeChild(link)
    }
    catch (error) {
      console.error('下载失败:', error)
      ElMessage({
        message: '下载失败',
        type: 'error',
      })
    }
  }

  // 导航索引
  function changeIndex(value: string) {
    configureStore.setActiveNavName(value)
  }

  function goBack(step: number = -1) {
    router.go(step)
  }

  return {
    getUserSex,
    getSongTitle,
    getSingerName,
    changeIndex,
    checkStatus,
    playMusic,
    goBack,
    downloadMusic,
  }
}

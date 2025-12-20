import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Icon } from '@/enums'

export const useSongStore = defineStore('song', () => {
  /** 音乐信息 */
  const songId = ref('') // 音乐 ID
  const songTitle = ref('') // 歌名
  const songUrl = ref('') // 音乐 URL
  const songPic = ref('/img/songPic/tubiao.jpg') // 歌曲图片
  const singerName = ref('') //  歌手名
  const lyric = ref<any[]>([]) // 处理后的歌词数据

  /** 音乐播放信息 */
  const isPlay = ref(false) // 播放状态
  const playBtnIcon = ref(Icon.PLAY) // 播放状态的图标
  const volume = ref(0) // 音量
  const duration = ref(0) // 音乐时长
  const curTime = ref(0) // 当前音乐的播放位置
  const changeTime = ref(0) // 指定播放时刻
  const autoNext = ref(true) // 用于触发自动播放下一首

  /** 音乐列表信息 */
  const currentPlayList = ref<any[]>([]) // 当前播放列表
  const songDetails = ref<any>(null) // 单个歌单信息
  const currentPlayIndex = ref(-1) // 当前歌曲在歌曲列表的位置

  // Actions
  function setSongId(newSongId: string) {
    songId.value = newSongId
  }

  function setSongTitle(newSongTitle: string) {
    songTitle.value = newSongTitle
  }

  function setSongUrl(newSongUrl: string) {
    songUrl.value = newSongUrl
  }

  function setSongPic(newSongPic: string) {
    songPic.value = newSongPic
  }

  function setSingerName(newSingerName: string) {
    singerName.value = newSingerName
  }

  function setAutoNext(newAutoNext: boolean) {
    autoNext.value = newAutoNext
  }

  function setLyric(newLyric: any[]) {
    lyric.value = newLyric
  }

  function setIsPlay(newIsPlay: boolean) {
    isPlay.value = newIsPlay
  }

  function setPlayBtnIcon(newPlayBtnIcon: typeof Icon.PLAY) { // Use the same type as the icon
    playBtnIcon.value = newPlayBtnIcon
  }

  function setVolume(newVolume: number) {
    volume.value = newVolume
  }

  function setDuration(newDuration: number) {
    duration.value = newDuration
  }

  function setCurTime(newCurTime: number) {
    curTime.value = newCurTime
  }

  function setChangeTime(newChangeTime: number) {
    changeTime.value = newChangeTime
  }

  function setCurrentPlayList(newCurrentPlayList: any[]) {
    currentPlayList.value = newCurrentPlayList
  }

  function setSongDetails(newSongDetails: any) {
    songDetails.value = newSongDetails
  }

  function setCurrentPlayIndex(newCurrentPlayIndex: number) {
    currentPlayIndex.value = newCurrentPlayIndex
  }

  function playMusic({
    id,
    url,
    pic,
    index,
    songTitle: newSongTitle,
    singerName: newSingerName,
    lyric: newLyric,
    currentSongList,
  }: {
    id: string
    url: string
    pic: string
    index: number
    songTitle: string
    singerName: string
    lyric: any[]
    currentSongList: any[]
  }) {
    setSongId(id)
    setSongUrl(url)
    setSongPic(pic)
    setCurrentPlayIndex(index)
    setSongTitle(newSongTitle)
    setSingerName(newSingerName)
    setLyric(newLyric)
    setCurrentPlayList(currentSongList)
  }

  return {
    // State
    songId,
    songTitle,
    songUrl,
    songPic,
    singerName,
    lyric,
    isPlay,
    playBtnIcon,
    volume,
    duration,
    curTime,
    changeTime,
    autoNext,
    currentPlayList,
    songDetails,
    currentPlayIndex,

    // Actions
    setSongId,
    setSongTitle,
    setSongUrl,
    setSongPic,
    setSingerName,
    setAutoNext,
    setLyric,
    setIsPlay,
    setPlayBtnIcon,
    setVolume,
    setDuration,
    setCurTime,
    setChangeTime,
    setCurrentPlayList,
    setSongDetails,
    setCurrentPlayIndex,
    playMusic,
  }
})

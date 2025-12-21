import type { Ref } from 'vue'
import { computed } from 'vue'
import { useApp } from '@/composables/useApp'
import { Icon } from '@/enums'
import { useSongStore } from '@/store'

export function usePlaylist(playStateValue: Ref<any>, _playStateListValue: Ref<any[]>) {
  const songStore = useSongStore()
  const { playMusic } = useApp()

  // Song Store getters
  const songUrl = computed(() => songStore.songUrl)
  const currentPlayList = computed(() => songStore.currentPlayList)
  const currentPlayIndex = computed(() => songStore.currentPlayIndex)

  // Previous track
  function prev() {
    if (playStateValue.value === Icon.SHUFFLE) {
      let playIndex = Math.floor(Math.random() * currentPlayList.value.length)
      playIndex = playIndex === currentPlayIndex.value ? playIndex + 1 : playIndex
      songStore.setCurrentPlayIndex(playIndex)
      toPlay(currentPlayList.value[playIndex]?.url || '')
    }
    else if (currentPlayIndex.value !== -1 && currentPlayList.value.length > 1) {
      if (currentPlayIndex.value > 0) {
        songStore.setCurrentPlayIndex(currentPlayIndex.value - 1)
        toPlay(currentPlayList.value[currentPlayIndex.value]?.url || '')
      }
      else {
        songStore.setCurrentPlayIndex(currentPlayList.value.length - 1)
        toPlay(currentPlayList.value[currentPlayIndex.value]?.url || '')
      }
    }
  }

  // Next track
  function next() {
    if (playStateValue.value === Icon.SHUFFLE) {
      let playIndex = Math.floor(Math.random() * currentPlayList.value.length)
      playIndex = playIndex === currentPlayIndex.value ? playIndex + 1 : playIndex
      songStore.setCurrentPlayIndex(playIndex)
      toPlay(currentPlayList.value[playIndex]?.url || '')
    }
    else if (currentPlayIndex.value !== -1 && currentPlayList.value.length > 1) {
      if (currentPlayIndex.value < currentPlayList.value.length - 1) {
        songStore.setCurrentPlayIndex(currentPlayIndex.value + 1)
        toPlay(currentPlayList.value[currentPlayIndex.value]?.url || '')
      }
      else {
        songStore.setCurrentPlayIndex(0)
        toPlay(currentPlayList.value[0]?.url || '')
      }
    }
  }

  // Select and play track
  function toPlay(url: string) {
    if (url && url !== songUrl.value) {
      const song = currentPlayList.value[currentPlayIndex.value]
      if (!song)
        return

      playMusic({
        id: song.id,
        url,
        pic: song.pic,
        index: currentPlayIndex.value,
        name: song.name,
        lyric: song.lyric,
        currentSongList: currentPlayList.value,
      })
    }
  }

  return {
    // Functions
    prev,
    next,
    toPlay,
  }
}

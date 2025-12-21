import { HttpManager } from '@/api'
import { Icon } from '@/enums'
import { useCollection } from './player/useCollection'
import { useNavigation } from './player/useNavigation'
import { usePlaylist } from './player/usePlaylist'
import { usePlayerState } from './player/useState'

export function usePlayerBar() {
  // Use specialized composables
  const {
    // Reactive state
    startTime,
    endTime,
    nowTime,
    volume,
    playState: playStateRef,
    playStateList: playStateListRef,
    playStateIndex,

    // Computed properties
    isPlay,
    playBtnIcon,
    songUrl,
    songTitle,
    singerName,
    songPic,
    curTime,
    duration,
    currentPlayList,
    currentPlayIndex,
    autoNext,

    // Functions
    togglePlay,
    changeTime,
    changePlayState,
  } = usePlayerState()

  const {
    // Reactive state
    isCollection,

    // Computed properties
    userId,
    songId,

    // Functions
    initCollection,
    changeCollection,
  } = useCollection()

  const {
    // Computed properties
    showAside,
    // Functions
    changeAside,
    goPlayerPage,
  } = useNavigation()

  // Note: We pass the playState and playStateList values to the usePlaylist composable
  const {
    // Functions
    prev,
    next,
    toPlay,
  } = usePlaylist(playStateRef, playStateListRef)

  const iconList = {
    download: Icon.DOWNLOAD,
    FOLD: Icon.FOLD,
    PREV: Icon.PREV,
    NEXT: Icon.NEXT,
    VOLUME: Icon.VOLUME1,
    MUTE: Icon.MUTE,
    LIST: Icon.LIST,
    dislike: Icon.DISLIKE,
    like: Icon.LIKE,
  }

  // Define attachImageUrl for use in template
  const attachImageUrl = HttpManager.attachImageUrl

  // Return all the reactive state and functions
  return {
    // Reactive state
    isCollection,
    startTime,
    endTime,
    nowTime,
    volume,
    playState: playStateRef,
    playStateList: playStateListRef,
    playStateIndex,
    iconList,

    // Computed properties
    userId,
    songId,
    isPlay,
    playBtnIcon,
    songUrl,
    songTitle,
    singerName,
    songPic,
    curTime,
    duration,
    currentPlayList,
    currentPlayIndex,
    autoNext,
    showAside,
    attachImageUrl,

    // Functions
    initCollection,
    changeCollection,
    changeAside,
    togglePlay,
    changeTime,
    changePlayState,
    prev,
    next,
    toPlay,
    goPlayerPage,
  }
}

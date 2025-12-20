import { computed, ref, watch } from 'vue'
import { Icon } from '@/enums'
import { useSongStore } from '@/store'
import { formatSeconds } from '@/utils'

export function usePlayerState() {
  const songStore = useSongStore()

  // Reactive state
  const startTime = ref('00:00')
  const endTime = ref('00:00')
  const nowTime = ref(0) // Progress bar position
  const volume = ref(50)
  const playState = ref(Icon.LOOP)
  const playStateList = ref([Icon.LOOP, Icon.SHUFFLE])
  const playStateIndex = ref(0)

  // Song Store getters
  const isPlay = computed(() => songStore.isPlay)
  const playBtnIcon = computed(() => songStore.playBtnIcon)
  const songUrl = computed(() => songStore.songUrl)
  const songTitle = computed(() => songStore.songTitle)
  const singerName = computed(() => songStore.singerName)
  const songPic = computed(() => songStore.songPic)
  const curTime = computed(() => songStore.curTime)
  const duration = computed(() => songStore.duration)
  const currentPlayList = computed(() => songStore.currentPlayList)
  const currentPlayIndex = computed(() => songStore.currentPlayIndex)
  const autoNext = computed(() => songStore.autoNext)

  // Watch for play state changes
  watch(isPlay, (value) => {
    songStore.setPlayBtnIcon(value ? Icon.PAUSE : Icon.PLAY)
  })

  // Watch for volume changes
  watch(volume, () => {
    const vol = Number.isNaN(volume.value) ? 0 : volume.value
    songStore.setVolume(vol / 100)
  })

  // Watch for time changes
  watch(curTime, () => {
    startTime.value = formatSeconds(curTime.value)
    endTime.value = formatSeconds(duration.value)
    // Move progress bar
    if (duration.value > 0 && !Number.isNaN(curTime.value) && !Number.isNaN(duration.value)) {
      nowTime.value = (curTime.value / duration.value) * 100
    }
  })

  // Control music play/pause
  function togglePlay() {
    songStore.setIsPlay(!isPlay.value)
  }

  function changeTime() {
    if (duration.value > 0) {
      const newTime = duration.value * (nowTime.value * 0.01)
      songStore.setChangeTime(newTime)
    }
  }

  function changePlayState() {
    playStateIndex.value = playStateIndex.value >= playStateList.value.length - 1 ? 0 : ++playStateIndex.value
    playState.value = playStateList.value[playStateIndex.value]
  }

  // Function to update time
  function updateTime() {
    startTime.value = formatSeconds(curTime.value)
    endTime.value = formatSeconds(duration.value)
    if (duration.value > 0 && !Number.isNaN(curTime.value) && !Number.isNaN(duration.value)) {
      nowTime.value = (curTime.value / duration.value) * 100
    }
  }

  return {
    // Reactive state
    startTime,
    endTime,
    nowTime,
    volume,
    playState,
    playStateList,
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
    updateTime,
  }
}

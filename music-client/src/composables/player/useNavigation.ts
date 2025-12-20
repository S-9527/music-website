import { computed } from 'vue'
import { useGoto } from '@/composables/goto'
import { useConfigureStore, useSongStore } from '@/store'

export function useNavigation() {
  const configureStore = useConfigureStore()
  const songStore = useSongStore()
  const { gotoLyric } = useGoto()

  // Configure Store getters
  const showAside = computed(() => configureStore.showAside)
  const songId = computed(() => songStore.songId)

  // Toggle sidebar visibility
  function changeAside() {
    configureStore.setShowAside(!showAside.value)
  }

  // Navigate to player page
  function goPlayerPage() {
    gotoLyric(songId.value)
  }

  return {
    // Computed properties
    showAside,
    songId,

    // Functions
    changeAside,
    goPlayerPage,
  }
}

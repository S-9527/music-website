import { ElMessage } from 'element-plus'
import { computed, ref, watch } from 'vue'
import { HttpManager } from '@/api'
import { useApp } from '@/composables/useApp'
import { useConfigureStore, useSongStore, useUserStore } from '@/store'

export function useCollection() {
  const userStore = useUserStore()
  const songStore = useSongStore()
  const configureStore = useConfigureStore()
  const { checkStatus } = useApp()

  // Reactive state
  const isCollection = ref<boolean>(false) // Whether song is collected

  // Getters
  const userId = computed(() => userStore.userId)
  const songId = computed(() => songStore.songId)
  const token = computed(() => configureStore.token)

  // Watch for song ID changes to initialize collection status
  watch(songId, () => {
    initCollection()
  })

  // Watch for token changes to reset collection status
  watch(token, (value) => {
    if (!value)
      isCollection.value = false
  })

  // Initialize collection status
  async function initCollection() {
    if (!checkStatus(false))
      return

    const result = await HttpManager.isCollection({
      userId: userId.value,
      type: 0,
      songId: songId.value,
    })
    // Handle the API response properly - the result.data might be a string, boolean, or number
    // Convert to boolean based on truthiness
    isCollection.value = !!result.data
  }

  // Change collection status (add/remove from collection)
  async function changeCollection() {
    if (!checkStatus())
      return

    const result = isCollection.value
      ? await HttpManager.deleteCollection(userId.value, songId.value)
      : await HttpManager.setCollection({
          userId: userId.value,
          type: 0, // Need to check this - shouldn't hardcode
          songId: songId.value,
        })
    ElMessage({
      message: result.message,
      type: result.type,
    })

    if (result.success)
      isCollection.value = !isCollection.value
  }

  return {
    // Reactive state
    isCollection,

    // Computed properties
    userId,
    songId,

    // Functions
    initCollection,
    changeCollection,
  }
}

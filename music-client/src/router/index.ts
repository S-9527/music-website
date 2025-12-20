import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { HttpManager } from '@/api'
import { useConfigureStore, useUserStore } from '@/store'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
  {
    path: '/404',
    component: () => import('@/views/error/404.vue'),
  },
  {
    path: '/',
    name: 'yin-container',
    component: () => import('@/views/YinContainer.vue'),
    children: [
      {
        path: '/',
        name: 'home',
        component: () => import('@/views/Home.vue'),
      },
      {
        path: '/sign-in',
        name: 'sign-in',
        component: () => import('@/views/SignIn.vue'),
      },
      {
        path: '/sign-up',
        name: 'sign-up',
        component: () => import('@/views/SignUp.vue'),
      },
      {
        path: '/personal',
        name: 'personal',
        meta: {
          requireAuth: true,
        },
        component: () => import('@/views/personal/Personal.vue'),
      },
      {
        path: '/song-sheet',
        name: 'song-sheet',
        component: () => import('@/views/song-sheet/SongSheet.vue'),
      },
      {
        path: '/song-sheet-detail/:id',
        name: 'song-sheet-detail',
        component: () => import('@/views/song-sheet/SongSheetDetail.vue'),
      },
      {
        path: '/singer',
        name: 'singer',
        component: () => import('@/views/singer/Singer.vue'),
      },
      {
        path: '/singer-detail/:id',
        name: 'singer-detail',
        component: () => import('@/views/singer/SingerDetail.vue'),
      },
      {
        path: '/lyric/:id',
        name: 'lyric',
        component: () => import('@/views/Lyric.vue'),
      },
      {
        path: '/search',
        name: 'search',
        component: () => import('@/views/search/Search.vue'),
      },
      {
        path: '/personal-data',
        name: 'personal-data',
        component: () => import('@/views/setting/PersonalData.vue'),
      },
      {
        path: '/FPassword',
        name: 'FPassword',
        component: () => import('@/views/FPassword.vue'),
      },
      {
        path: '/loginByemail',
        name: 'loginByemail',
        component: () => import('@/views/loginByemail.vue'),
      },
      {
        path: '/setting',
        name: 'setting',
        meta: {
          requireAuth: true,
        },
        component: () => import('@/views/setting/Setting.vue'),
        children: [
          {
            path: '/setting/PersonalData',
            name: 'personalData',
            meta: {
              requireAuth: true,
            },
            component: () => import('@/views/setting/PersonalData.vue'),
          },
        ],
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Global navigation guard
router.beforeEach(async (to, _, next) => {
  const configureStore = useConfigureStore()
  const userStore = useUserStore()

  // Check if route requires authentication
  if (to.meta.requireAuth) {
    // If user is not logged in, redirect to home
    if (!configureStore.token) {
      next('/')
      return
    }
  }

  // If user is logged in but user info is not fully loaded, fetch it
  if (configureStore.token && userStore.userId && (!userStore.username || !userStore.userPic)) {
    // User ID is available but other info is missing, fetch complete user info
    try {
      const result = await HttpManager.getUserOfId(userStore.userId)
      if (result.data && result.data[0]) {
        userStore.setUserInfo(result.data[0])
      }
    }
    catch (error) {
      console.error('Failed to fetch user info:', error)
      // If we can't get user info, clear the token and redirect
      configureStore.setToken(false)
      next('/')
      return
    }
  }

  next()
})

export default router

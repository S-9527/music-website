import { useRouter } from 'vue-router'
import { RouterName } from '@/router/const'

export function useGoto() {
  const router = useRouter()

  function gotoHome() {
    router.push({
      name: RouterName.Home,
    })
  }

  function gotoSongSheet() {
    router.push({
      name: RouterName.SongSheet,
    })
  }

  function gotoSongSheetDetail(id: string | number) {
    router.push({
      name: RouterName.SongSheetDetail,
      params: { id },
    })
  }

  function gotoSinger() {
    router.push({
      name: RouterName.Singer,
    })
  }

  function gotoSingerDetail(id: string | number) {
    router.push({
      name: RouterName.SingerDetail,
      params: { id },
    })
  }

  function gotoPersonal() {
    router.push({
      name: RouterName.Personal,
    })
  }

  function gotoSetting() {
    router.push({
      name: RouterName.Setting,
    })
  }

  function gotoPersonalData() {
    router.push({
      name: RouterName.PersonalData,
    })
  }

  function gotoSignIn() {
    router.push({
      name: RouterName.SignIn,
    })
  }

  function gotoSignUp() {
    router.push({
      name: RouterName.SignUp,
    })
  }

  function gotoSearch(query?: { keywords?: string }) {
    router.push({
      name: RouterName.Search,
      query,
    })
  }

  function gotoLyric(id: string | number) {
    router.push({
      name: RouterName.Lyric,
      params: { id },
    })
  }

  function gotoError() {
    router.push({
      name: RouterName.Error,
    })
  }

  function gotoForgotPassword() {
    router.push({
      name: RouterName.ForgotPassword,
    })
  }

  function gotoLoginByEmail() {
    router.push({
      name: RouterName.LoginByemail,
    })
  }

  return {
    gotoHome,
    gotoSongSheet,
    gotoSongSheetDetail,
    gotoSinger,
    gotoSingerDetail,
    gotoPersonal,
    gotoSetting,
    gotoPersonalData,
    gotoSignIn,
    gotoSignUp,
    gotoSearch,
    gotoLyric,
    gotoError,
    gotoForgotPassword,
    gotoLoginByEmail,
  }
}

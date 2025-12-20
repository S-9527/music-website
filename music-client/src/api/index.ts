import { bannerAPI } from './modules/banner.ts'
import { collectionAPI } from './modules/collection.ts'
import { commentAPI } from './modules/comment.ts'
import { rankAPI } from './modules/rank.ts'
import { singerAPI } from './modules/singer.ts'
import { songAPI } from './modules/song.ts'
import { songListAPI } from './modules/songList.ts'
import { supportAPI } from './modules/support.ts'
import { userAPI } from './modules/user.ts'
import { getBaseURL } from './request'

const HttpManager = {
  // 获取图片信息
  attachImageUrl: (url: any) => url ? `${getBaseURL()}/${url}` : 'https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png',
  ...userAPI,
  ...songListAPI,
  ...singerAPI,
  ...collectionAPI,
  ...rankAPI,
  ...commentAPI,
  ...songAPI,
  ...bannerAPI,
  ...supportAPI,
}

export { HttpManager }

import type { Song } from '@/types'
import { deletes, get, post } from '../request.ts'

interface SetCollectionParams {
  userId: string
  type: number
  songId: string
}

interface IsCollectionParams {
  userId: string
  type: number
  songId: string
}

export const collectionAPI = {
  // 返回的指定用户ID的收藏列表
  getCollectionOfUser: (userId: string) => get<Song[]>(`collection/detail?userId=${userId}`),
  // 添加收藏的歌曲 type: 0 代表歌曲， 1 代表歌单
  setCollection: ({ userId, type, songId }: SetCollectionParams) => post(`collection/add`, { userId, type, songId }),
  deleteCollection: (userId: string, songId: string) => deletes(`collection/delete?userId=${userId}&&songId=${songId}`),
  isCollection: ({ userId, type, songId }: IsCollectionParams) => post(`collection/status`, { userId, type, songId }),
}

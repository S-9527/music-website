import type { SongList } from '@/types'
import { get } from '../request.ts'

export interface PaginationParams {
  pageNum?: number
  pageSize?: number
}

export const songListAPI = {
  // 获取全部歌单
  getSongList: (params?: PaginationParams) => get('songList', params),
  // 获取歌单类型
  getSongListOfStyle: (style: string, params?: PaginationParams) => get(`songList/style/detail?style=${style}`, params),
  // 返回标题包含文字的歌单
  getSongListOfLikeTitle: (keywords: string, params?: PaginationParams) => get(`songList/likeTitle/detail?title=${keywords}`, params),
  // 返回歌单里指定歌单ID的歌曲
  getListSongOfSongId: (songListId: string) => get(`listSong/detail?songListId=${songListId}`),
}

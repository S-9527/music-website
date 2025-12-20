import type { SongList } from '@/types'
import { get } from '../request.ts'

export const songListAPI = {
  // 获取全部歌单
  getSongList: () => get<SongList[]>('songList'),
  // 获取歌单类型
  getSongListOfStyle: (style: string) => get<SongList[]>(`songList/style/detail?style=${style}`),
  // 返回标题包含文字的歌单
  getSongListOfLikeTitle: (keywords: string) => get<SongList[]>(`songList/likeTitle/detail?title=${keywords}`),
  // 返回歌单里指定歌单ID的歌曲
  getListSongOfSongId: (songListId: string) => get(`listSong/detail?songListId=${songListId}`),
}

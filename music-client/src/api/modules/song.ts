import type { Song } from '@/types'
import { get } from '../request.ts'

export const songAPI = {
  // 返回指定歌曲ID的歌曲
  getSongOfId: (id: string) => get<Song[]>(`song/detail?id=${id}`),
  // 返回指定歌手ID的歌曲
  getSongOfSingerId: (id: number) => get<Song[]>(`song/singer/detail?singerId=${id}`),
  // 返回指定歌手名的歌曲
  getSongOfSingerName: (keywords: string) => get<Song[]>(`song/singerName/detail?name=${keywords}`),
  // 下载音乐
  downloadMusic: (url: string) => get(url, { responseType: 'blob' }),
}

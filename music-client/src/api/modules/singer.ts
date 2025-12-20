import type { Singer } from '@/types'
import { get } from '../request.ts'

export const singerAPI = {
  // 返回所有歌手
  getAllSinger: () => get<Singer[]>('singer'),
  // 通过性别对歌手分类
  getSingerOfSex: (sex: number) => get<Singer[]>(`singer/sex/detail?sex=${sex}`),
}

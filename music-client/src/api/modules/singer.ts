import type { Singer } from '@/types'
import { get } from '../request.ts'

export interface PaginationParams {
  pageNum?: number
  pageSize?: number
}

export const singerAPI = {
  // 返回所有歌手
  getAllSinger: (params?: PaginationParams) => get('singer', params),
  // 通过性别对歌手分类
  getSingerOfSex: (sex: number, params?: PaginationParams) => get(`singer/sex/detail?sex=${sex}`, params),
}

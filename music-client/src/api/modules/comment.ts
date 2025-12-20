import type { Comment } from '@/types'
import { get, post } from '../request.ts'

interface SetCommentParams {
  userId: string
  content: string
  songId?: string
  songListId?: string
  nowType: number
}

interface SetSupportParams {
  id: number
  up: number
}

export const commentAPI = {
  // 添加评论
  setComment: ({ userId, content, songId, songListId, nowType }: SetCommentParams) => post(`comment/add`, { userId, content, songId, songListId, nowType }),
  // 删除评论
  deleteComment: (id: number) => get(`comment/delete?id=${id}`),
  // 点赞
  setSupport: ({ id, up }: SetSupportParams) => post(`comment/like`, { id, up }),
  // 返回所有评论
  getAllComment: (type: number, id: string) => {
    let url = ''
    if (type === 1) {
      url = `comment/songList/detail?songListId=${id}`
    }
    else if (type === 0) {
      url = `comment/song/detail?songId=${id}`
    }
    return get<Comment[]>(url)
  },
}

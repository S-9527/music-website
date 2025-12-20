import { post } from '../request.ts'

interface SupportParams {
  commentId: number
  userId: string
}

export const supportAPI = {
  // 点赞api的优化 避免有些是重复的点赞！新增数据表了得
  testAlreadySupport: ({ commentId, userId }: SupportParams) => post(`userSupport/test`, { commentId, userId }),
  deleteUserSupport: ({ commentId, userId }: SupportParams) => post(`userSupport/delete`, { commentId, userId }),
  insertUserSupport: ({ commentId, userId }: SupportParams) => post(`userSupport/insert`, { commentId, userId }),
}

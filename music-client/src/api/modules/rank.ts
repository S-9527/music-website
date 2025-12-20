import { get, post } from '../request.ts'

interface SetRankParams {
  songListId: string
  consumerId: string
  score: number
}

export const rankAPI = {
  // 提交评分
  setRank: ({ songListId, consumerId, score }: SetRankParams) => post(`rankList/add`, { songListId, consumerId, score }),
  // 获取指定歌单的评分
  getRankOfSongListId: (songListId: string) => get(`rankList?songListId=${songListId}`),
  // 获取指定用户的歌单评分
  getUserRank: (consumerId: string, songListId: string) => get(`/rankList/user?consumerId=${consumerId}&songListId=${songListId}`),
}

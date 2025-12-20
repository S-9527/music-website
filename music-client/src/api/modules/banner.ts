import type { SwiperItem } from '@/types'
import { get } from '../request.ts'

export const bannerAPI = {
  // 获取所有的海报
  getBannerList: () => get<SwiperItem[]>('banner/getAllBanner'),
}

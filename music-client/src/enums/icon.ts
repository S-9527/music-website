// lucide-vue-next icons mapping
import { ChevronUp, Download, Headphones, Heart, HeartOff, List, Pause, Play, Repeat, Search, Shuffle, SkipBack, SkipForward, ThumbsUp, Volume, Volume2, VolumeX } from 'lucide-vue-next'

// Export the icons for use as direct imports or through YinIcon component
export {
  ChevronUp,
  Download,
  Headphones,
  Heart,
  HeartOff,
  List,
  Pause,
  Play,
  Repeat,
  Search,
  Shuffle,
  SkipBack,
  SkipForward,
  ThumbsUp,
  Volume,
  Volume2,
  VolumeX,
}

// For backward compatibility with existing code that uses Icon.XXX
export const Icon = {
  PLAY: Play, // 播放
  PAUSE: Pause, // 暂停
  VOLUME: Volume2, // 音量有背景
  VOLUME1: Volume2, // 音量无 background (using same icon)
  HEADPHONES: Headphones, // 耳机
  SEARCH: Search, // 搜索
  DOWNLOAD: Download, // 下载
  FOLD: ChevronUp, // 折叠 (rotated chevron for fold)
  PREV: SkipBack, // 上一首
  NEXT: SkipForward, // 下一首
  MUTE: VolumeX, // 静音
  LIST: List, // 列表
  DISLIKE: HeartOff, // 未收藏
  LIKE: Heart, // 收藏
  SUPPORT: ThumbsUp, // 赞
  LOOP: Repeat, // 循环
  SHUFFLE: Shuffle, // 乱序
}

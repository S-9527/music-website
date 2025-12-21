// Music related types
export interface Song {
  id: string
  name: string
  title?: string
  url: string
  pic: string
  lyric: string
  introduction?: string
  songName?: string
  singerName?: string
  index?: number
  songId?: string // Add missing songId property
}

export interface SongList {
  id: number
  title: string
  pic: string
  introduction?: string
  collectNum?: number
}

export interface Singer {
  id: number
  name: string
  pic: string
  sex?: number
  birth?: string
  location?: string
  introduction?: string
}

export interface User {
  id: string
  username: string
  avator: string
  sex?: number
  birth?: string
  location?: string
  introduction?: string
  phoneNum?: string
  email?: string
}

export interface SwiperItem {
  id: number
  pic: string
}

export interface Comment {
  id: number
  userId: number
  type: number // 0 for song, 1 for song list
  songId?: string
  songListId?: string
  content: string
  createTime: string
  up: number
  username?: string
  avator?: string
}

// Audio playback types
export interface PlaybackState {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  progress: number
}

export interface LyricLine {
  time: number
  text: string
}

// Pagination response type
export interface PageResult<T> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

// API response types
export interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
  success: boolean
  type?: string
}

export interface ResponseBody<T = any> {
  code: number
  data: T
  msg?: string
  message?: string
  success: boolean
  type?: string
}

// Error handling types
export interface AppError {
  code: string
  message: string
  context: string
  timestamp: Date
}

// Utility function types
export type DateValue = string | number | Date
export type NumericValue = string | number

// List management types
export interface ListState<T> {
  items: T[]
  loading: boolean
  error: Error | null
}

// Form validation types
export interface ValidationRule {
  required?: boolean
  pattern?: RegExp
  message?: string
  validator?: (value: any) => boolean | string
}

export interface FormField {
  value: any
  error?: string
  touched: boolean
}

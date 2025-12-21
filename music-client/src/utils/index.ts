// 解析日期
export function getBirth(value: string | number | Date | null | undefined): string {
  if (value == null || value === '')
    return ''
  const date = new Date(value)
  const year = date.getFullYear()
  const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
  return `${year}-${month}-${day}`
}

/**
 * 表格时间格式化
 */
export function formatDate(cellValue: string | number | Date | null | undefined): string {
  if (cellValue == null || cellValue === '')
    return ''
  const date = new Date(cellValue)
  const year = date.getFullYear()
  const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
  const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
  const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
  const seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 解析歌词
export function parseLyric(text: string): [number, string][] {
  if (!text)
    return [[0, '']]

  const lines = text.split('\n')
  const pattern = /\[\d{2}:\d{2}.(\d{3}|\d{2})\]/g
  const result: [number, string][] = []

  // 对于歌词格式不对的特殊处理
  if (!/\[.+\]/.test(text)) {
    return [[0, text]]
  }

  // 过滤掉不包含时间戳的行
  while (lines.length > 0 && !pattern.test(lines[0]!)) {
    lines.shift()
  }

  if (lines.length > 0 && lines[lines.length - 1]?.length === 0) {
    lines.pop()
  }

  for (const item of lines) {
    if (!item)
      continue

    const timeMatches = item.match(pattern) // 存前面的时间段
    const lyricText = item.replace(pattern, '') // 存歌词

    if (!timeMatches)
      continue

    for (const timeMatch of timeMatches) {
      const t = timeMatch.slice(1, -1).split(':')
      if (t.length === 2 && lyricText !== '') {
        const minutes = Number.parseInt(t[0] || '0', 10)
        const seconds = Number.parseFloat(t[1] || '0')
        result.push([minutes * 60 + seconds, lyricText])
      }
    }
  }

  result.sort((a, b) => a[0] - b[0])
  return result
}

// 解析播放时间
export function formatSeconds(value: string | number | undefined): string {
  const timeStr = typeof value === 'string' ? (value || '0') : value?.toString() || '0'
  const time = Number.parseFloat(timeStr)
  if (Number.isNaN(time) || time < 0)
    return '00:00'

  const totalSeconds = Math.floor(time)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  else {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
}

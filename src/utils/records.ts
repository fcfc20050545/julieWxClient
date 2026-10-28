export type CheckinRecord = {
  nickname: string
  checkedAt: number
}

export type RecordRow = {
  date: string
  nickname: string
  lastCheckin: string
  overtime: boolean
}

export const TIMEOUT_TIME = '23:30:00'

const WEEKDAYS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

export function pad(value: number) {
  return String(value).padStart(2, '0')
}

export function formatClock(ts: number) {
  const date = new Date(ts)
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

export function formatDateLine(ts: number) {
  const date = new Date(ts)
  return `${date.getFullYear()}年${pad(date.getMonth() + 1)}月${pad(date.getDate())}日 ${WEEKDAYS[date.getDay()]}`
}

export function localParts(ts: number) {
  const date = new Date(ts)
  const ymd = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
  const hms = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  return {
    date: ymd,
    hms,
    display: `${ymd} ${pad(date.getHours())}:${pad(date.getMinutes())}`
  }
}

export function normalizeTimeout(timeout: string) {
  const [hour = '00', minute = '00', second = '00'] = timeout.split(':')
  return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:${second.padStart(2, '0')}`
}

export function isOvertime(hms: string, timeout = TIMEOUT_TIME) {
  return hms > normalizeTimeout(timeout)
}

export function buildRows(checkins: CheckinRecord[], timeout = TIMEOUT_TIME): RecordRow[] {
  const byDate = new Map<string, CheckinRecord>()
  checkins.forEach((item) => {
    const parts = localParts(item.checkedAt)
    const prev = byDate.get(parts.date)
    if (!prev || item.checkedAt >= prev.checkedAt) {
      byDate.set(parts.date, {
        nickname: item.nickname.trim() || '微信用户',
        checkedAt: item.checkedAt
      })
    }
  })

  return Array.from(byDate.entries())
    .sort((left, right) => (left[0] < right[0] ? 1 : -1))
    .map(([date, last]) => {
      const parts = localParts(last.checkedAt)
      return {
        date,
        nickname: last.nickname,
        lastCheckin: parts.display,
        overtime: isOvertime(parts.hms, timeout)
      }
    })
}

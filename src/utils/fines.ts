import { formatCheckInLabel } from './records.ts'

export type SleepFineDayItem = {
  date?: string
  lastCheckInTime?: string
  overtime?: boolean
  fine?: number
}

export type SleepFineUserItem = {
  openId?: string
  avatarUrl?: string | null
  nickName?: string | null
  overtimeDays?: number
  totalFine?: number
  days?: SleepFineDayItem[]
}

export type FineDayRow = {
  key: string
  date: string
  lastCheckin: string
  overtime: boolean
  fine: number
}

export type FineUserRow = {
  key: string
  avatarUrl: string
  nickname: string
  overtimeDays: number
  totalFine: number
  days: FineDayRow[]
}

export function currentMonth(ts = Date.now()) {
  const date = new Date(ts)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${date.getFullYear()}-${month}`
}

export function mapSleepFines(users: SleepFineUserItem[]): FineUserRow[] {
  return users.map((user, index) => {
    const openId = user.openId || ''
    const key = openId || String(index)
    const days = (user.days || []).map((day) => {
      const date = day.date || ''
      return {
        key: `${key}:${date}`,
        date,
        lastCheckin: formatCheckInLabel(day.lastCheckInTime || ''),
        overtime: Boolean(day.overtime),
        fine: day.fine ?? 0
      }
    })
    return {
      key,
      avatarUrl: (user.avatarUrl || '').trim(),
      nickname: (user.nickName || '').trim() || '微信用户',
      overtimeDays: user.overtimeDays ?? 0,
      totalFine: user.totalFine ?? 0,
      days
    }
  })
}

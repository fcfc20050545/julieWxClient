import { callCloud } from './cloud'
import type { SleepFineUserItem } from '../utils/fines'
import type { SleepRecordItem } from '../utils/records'

type ApiEnvelope<T> = {
  code: number
  errorMsg: string
  data: T
}

export type CheckInResult = {
  id: number
  openId: string
  avatarUrl: string | null
  nickName: string | null
  checkInTime: string
}

export type SleepRecordsResult = {
  month: string
  deadline: string
  finePerDay: number
  records: SleepRecordItem[]
}

export type SleepFinesResult = {
  month: string
  deadline: string
  finePerDay: number
  users: SleepFineUserItem[]
}

export function checkIn(nickName: string, avatarUrl: string) {
  return request<CheckInResult>('/api/sleep/check-in', 'POST', { nickName, avatarUrl })
}

export function listRecords() {
  return request<SleepRecordsResult>('/api/sleep/records', 'GET')
}

export function listFines(month: string) {
  const query = encodeURIComponent(month)
  return request<SleepFinesResult>(`/api/sleep/fines?month=${query}`, 'GET')
}

async function request<T>(path: string, method: 'GET' | 'POST', data?: Record<string, unknown>) {
  const body = await callCloud<ApiEnvelope<T>>({ path, method, data })
  if (body.errorMsg) {
    throw new Error(body.errorMsg)
  }
  return body.data
}

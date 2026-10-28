import Taro from '@tarojs/taro'
import type { CheckinRecord } from '../utils/records'

const NICKNAME_KEY = 'sleep_nickname'
const CHECKINS_KEY = 'sleep_checkins'

export function getNickname() {
  const value = Taro.getStorageSync(NICKNAME_KEY)
  return typeof value === 'string' ? value : ''
}

export function saveNickname(nickname: string) {
  Taro.setStorageSync(NICKNAME_KEY, nickname.trim())
}

export function getCheckins(): CheckinRecord[] {
  const value = Taro.getStorageSync(CHECKINS_KEY)
  if (!Array.isArray(value)) return []
  return value.filter((item): item is CheckinRecord => {
    return Boolean(item) && typeof item.checkedAt === 'number' && typeof item.nickname === 'string'
  })
}

export function addCheckin(nickname: string, checkedAt: number) {
  const list = getCheckins()
  list.push({
    nickname: nickname.trim() || '微信用户',
    checkedAt
  })
  Taro.setStorageSync(CHECKINS_KEY, list)
}

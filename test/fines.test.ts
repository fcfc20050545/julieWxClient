import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { currentMonth, mapSleepFines } from '../src/utils/fines.ts'

describe('monthly fines', () => {
  it('formats the current month as yyyy-mm', () => {
    const ts = new Date(2026, 9, 28, 18, 0, 0).getTime()
    assert.equal(currentMonth(ts), '2026-10')
  })

  it('keeps server order and maps nickname, counts, and day details', () => {
    const rows = mapSleepFines([
      {
        openId: 'late',
        avatarUrl: '   ',
        nickName: '   ',
        overtimeDays: 1,
        totalFine: 100,
        days: [
          {
            date: '2026-10-27',
            lastCheckInTime: '2026-10-28T00:30:00',
            overtime: true,
            fine: 100
          }
        ]
      },
      {
        openId: 'on-time',
        avatarUrl: 'cloud://avatar',
        nickName: 'liu',
        overtimeDays: 0,
        totalFine: 0,
        days: [
          {
            date: '2026-10-28',
            lastCheckInTime: '2026-10-28T22:30:00',
            overtime: false,
            fine: 0
          }
        ]
      }
    ])
    assert.deepEqual(rows, [
      {
        key: 'late',
        avatarUrl: '',
        nickname: '微信用户',
        overtimeDays: 1,
        totalFine: 100,
        days: [
          {
            key: 'late:2026-10-27',
            date: '2026-10-27',
            lastCheckin: '2026-10-28 00:30',
            overtime: true,
            fine: 100
          }
        ]
      },
      {
        key: 'on-time',
        avatarUrl: 'cloud://avatar',
        nickname: 'liu',
        overtimeDays: 0,
        totalFine: 0,
        days: [
          {
            key: 'on-time:2026-10-28',
            date: '2026-10-28',
            lastCheckin: '2026-10-28 22:30',
            overtime: false,
            fine: 0
          }
        ]
      }
    ])
  })
})

import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  TIMEOUT_TIME,
  buildRows,
  formatClock,
  formatDateLine,
  isOvertime
} from '../src/utils/records.ts'

function at(year: number, month: number, day: number, hour: number, minute: number, second: number) {
  return new Date(year, month - 1, day, hour, minute, second).getTime()
}

describe('check-in rows', () => {
  it('formats the clock and date line', () => {
    const ts = at(2026, 10, 28, 23, 18, 42)
    assert.equal(formatClock(ts), '23:18:42')
    assert.equal(formatDateLine(ts), '2026年10月28日 星期三')
  })

  it('returns no rows when there are no check-ins', () => {
    assert.deepEqual(buildRows([]), [])
  })

  it('shows the last check-in of a day as yyyy-mm-dd hh:mm', () => {
    const rows = buildRows([
      { nickname: 'liu', checkedAt: at(2026, 10, 28, 22, 10, 1) },
      { nickname: 'liu', checkedAt: at(2026, 10, 28, 22, 48, 16) }
    ])
    assert.deepEqual(rows, [
      {
        date: '2026-10-28',
        nickname: 'liu',
        lastCheckin: '2026-10-28 22:48',
        overtime: false
      }
    ])
  })

  it('marks a punch after the timeout as overtime, including seconds hidden from the label', () => {
    const rows = buildRows([
      { nickname: 'liu', checkedAt: at(2026, 10, 27, 23, 46, 12) },
      { nickname: 'liu', checkedAt: at(2026, 10, 28, 23, 30, 1) }
    ], TIMEOUT_TIME)
    assert.equal(rows[0].date, '2026-10-28')
    assert.equal(rows[0].lastCheckin, '2026-10-28 23:30')
    assert.equal(rows[0].overtime, true)
    assert.equal(rows[1].lastCheckin, '2026-10-27 23:46')
    assert.equal(rows[1].overtime, true)
  })

  it('treats the timeout instant itself as on time', () => {
    assert.equal(isOvertime('23:30:00'), false)
  })

  it('puts a punch after midnight on the new day and compares the clock only', () => {
    const rows = buildRows([
      { nickname: 'liu', checkedAt: at(2026, 10, 28, 0, 12, 3) }
    ])
    assert.deepEqual(rows, [
      {
        date: '2026-10-28',
        nickname: 'liu',
        lastCheckin: '2026-10-28 00:12',
        overtime: false
      }
    ])
  })

  it('uses 微信用户 when the stored nickname is blank', () => {
    const rows = buildRows([
      { nickname: '   ', checkedAt: at(2026, 10, 26, 22, 18, 5) }
    ])
    assert.equal(rows[0].nickname, '微信用户')
    assert.equal(rows[0].overtime, false)
  })
})

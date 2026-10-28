import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { stageLayout } from '../src/utils/layout.ts'

describe('check-in stage', () => {
  it('keeps the clock at the middle and the button low on a tall screen', () => {
    const box = stageLayout(700, 375)
    assert.equal(box.height, 700)
    assert.equal(box.clockTop, 350)
    assert.equal(box.buttonTop, 546)
  })

  it('moves the clock up on a short screen so the button and confirmation stay visible', () => {
    const box = stageLayout(480, 375)
    const clockHalf = 42
    const buttonHalf = 74
    assert.ok(box.buttonTop + buttonHalf + 36 <= box.height)
    assert.ok(box.buttonTop - buttonHalf - (box.clockTop + clockHalf) >= 24)
  })
})

import { describe, expect, it } from 'vitest'
import { getStatusLabel, getStatusTone } from './status'

describe('getStatusLabel', () => {
  it('maps every backend status to a human label', () => {
    expect(getStatusLabel('ACTIVE')).toBe('Active')
    expect(getStatusLabel('AGING')).toBe('Aging')
    expect(getStatusLabel('DEADSTOCK_FLAGGED')).toBe('Deadstock')
    expect(getStatusLabel('SUBMITTED_FOR_VERIFICATION')).toBe('Submitted')
  })
})

describe('getStatusTone', () => {
  it('escalates tone as inventory ages toward deadstock', () => {
    expect(getStatusTone('ACTIVE')).toBe('neutral')
    expect(getStatusTone('AGING')).toBe('warning')
    expect(getStatusTone('DEADSTOCK_FLAGGED')).toBe('danger')
    expect(getStatusTone('SUBMITTED_FOR_VERIFICATION')).toBe('info')
  })
})

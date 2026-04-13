import { describe, expect, it } from 'vitest'
import { decodeCursor, encodeCursor } from '../src/services/cursor.service'
import { AppError } from '../src/types/error.types'

describe('cursor.service', () => {
  it('should encode and decode a cursor correctly', () => {
    const payload = {
      createdAt: '2026-04-12T18:00:00.000Z',
      id: 'task-123',
    }

    const cursor = encodeCursor(payload)
    const decoded = decodeCursor(cursor)

    expect(decoded).toEqual(payload)
  })

  it('should throw AppError for an invalid cursor', () => {
    expect(() => decodeCursor('invalid-cursor')).toThrow(AppError)
  })
})
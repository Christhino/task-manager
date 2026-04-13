import { AppError } from '../types/error.types'
import type { TaskCursorPayload } from '../types/task.types'

export function encodeCursor(payload: TaskCursorPayload): string {
  return Buffer.from(JSON.stringify(payload)).toString('base64url')
}

export function decodeCursor(cursor: string): TaskCursorPayload {
  try {
    const parsed = JSON.parse(
      Buffer.from(cursor, 'base64url').toString('utf-8')
    ) as TaskCursorPayload

    if (!parsed.createdAt || !parsed.id) {
      throw new Error('Invalid cursor payload')
    }

    return parsed
  } catch {
    throw new AppError(400, 'INVALID_CURSOR', 'Invalid cursor format')
  }
}
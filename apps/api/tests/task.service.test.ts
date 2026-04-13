import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AppError } from '../src/types/error.types'
import { taskService } from '../src/services/task.service'
import { taskRepository } from '../src/db/task.repository'

vi.mock('../src/db/task.repository', () => ({
  taskRepository: {
    create: vi.fn(),
    findById: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    list: vi.fn(),
  },
}))

describe('task.service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return a task by id', () => {
    const fakeTask = {
      id: '1',
      title: 'Test task',
      description: null,
      status: 'todo' as const,
      dueDate: null,
      createdAt: '2026-04-12T18:00:00.000Z',
      updatedAt: '2026-04-12T18:00:00.000Z',
    }

    vi.mocked(taskRepository.findById).mockReturnValue(fakeTask)

    const result = taskService.getTaskById('1')

    expect(result).toEqual(fakeTask)
    expect(taskRepository.findById).toHaveBeenCalledWith('1')
  })

  it('should throw TASK_NOT_FOUND when task does not exist', () => {
    vi.mocked(taskRepository.findById).mockReturnValue(null)

    expect(() => taskService.getTaskById('unknown')).toThrow(AppError)
  })

  it('should return success when deleting an existing task', () => {
    vi.mocked(taskRepository.delete).mockReturnValue(true)

    const result = taskService.deleteTask('1')

    expect(result).toEqual({ success: true })
    expect(taskRepository.delete).toHaveBeenCalledWith('1')
  })

  it('should throw TASK_NOT_FOUND when deleting a missing task', () => {
    vi.mocked(taskRepository.delete).mockReturnValue(false)

    expect(() => taskService.deleteTask('missing')).toThrow(AppError)
  })
})
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AppError } from '../src/types/error.types'
import { taskService } from '../src/services/task.service'
import { taskRepository } from '../src/db/task.repository'
import * as cursorService from '../src/services/cursor.service'

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

  it('should update a task', () => {
    const updatedTask = {
      id: '1',
      title: 'Updated title',
      description: null,
      status: 'done' as const,
      dueDate: null,
      createdAt: '2026-04-12T18:00:00.000Z',
      updatedAt: '2026-04-12T19:00:00.000Z',
    }

    vi.mocked(taskRepository.update).mockReturnValue(updatedTask)

    const result = taskService.updateTask('1', {
      title: 'Updated title',
      status: 'done',
    })

    expect(taskRepository.update).toHaveBeenCalledWith('1', {
      title: 'Updated title',
      status: 'done',
    })
    expect(result).toEqual(updatedTask)
  })

  it('should throw TASK_NOT_FOUND when update target does not exist', () => {
    vi.mocked(taskRepository.update).mockReturnValue(null)

    expect(() =>
      taskService.updateTask('missing', {
        status: 'done',
      })
    ).toThrow(AppError)
  })

  it('should list tasks and compute nextCursor when there are more results', () => {
    const encodeSpy = vi.spyOn(cursorService, 'encodeCursor')
    const decodeSpy = vi.spyOn(cursorService, 'decodeCursor')

    decodeSpy.mockReturnValue({
      createdAt: '2026-04-12T18:00:00.000Z',
      id: 'cursor-task',
    })

    encodeSpy.mockReturnValue('next-cursor-token')

    vi.mocked(taskRepository.list).mockReturnValue([
      {
        id: '1',
        title: 'Task 1',
        description: null,
        status: 'todo',
        dueDate: null,
        createdAt: '2026-04-12T20:00:00.000Z',
        updatedAt: '2026-04-12T20:00:00.000Z',
      },
      {
        id: '2',
        title: 'Task 2',
        description: null,
        status: 'done',
        dueDate: null,
        createdAt: '2026-04-12T19:00:00.000Z',
        updatedAt: '2026-04-12T19:00:00.000Z',
      },
      {
        id: '3',
        title: 'Task 3',
        description: null,
        status: 'todo',
        dueDate: null,
        createdAt: '2026-04-12T18:00:00.000Z',
        updatedAt: '2026-04-12T18:00:00.000Z',
      },
    ])

    const result = taskService.listTasks({
      status: 'todo',
      search: 'Task',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      limit: 2,
      cursor: 'incoming-cursor',
    })

    expect(decodeSpy).toHaveBeenCalledWith('incoming-cursor')
    expect(taskRepository.list).toHaveBeenCalledWith({
      status: 'todo',
      search: 'Task',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      limit: 3,
      cursorData: {
        createdAt: '2026-04-12T18:00:00.000Z',
        id: 'cursor-task',
      },
    })

    expect(result.data).toHaveLength(2)
    expect(result.pageInfo.hasMore).toBe(true)
    expect(result.pageInfo.nextCursor).toBe('next-cursor-token')
  })

  it('should list tasks without nextCursor when there is no extra page', () => {
    vi.mocked(taskRepository.list).mockReturnValue([
      {
        id: '1',
        title: 'Task 1',
        description: null,
        status: 'todo',
        dueDate: null,
        createdAt: '2026-04-12T20:00:00.000Z',
        updatedAt: '2026-04-12T20:00:00.000Z',
      },
    ])

    const result = taskService.listTasks({
      sortBy: 'createdAt',
      sortOrder: 'desc',
      limit: 10,
    })

    expect(result.data).toHaveLength(1)
    expect(result.pageInfo.hasMore).toBe(false)
    expect(result.pageInfo.nextCursor).toBeNull()
  })
})
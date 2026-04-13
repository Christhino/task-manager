import { taskRepository } from '../db/task.repository'
import { decodeCursor, encodeCursor } from './cursor.service'
import { AppError } from '../types/error.types'
import type { TaskListParams } from '../types/task.types'

export const taskService = {
  createTask(input: {
    title: string
    description?: string | null
    status: 'todo' | 'in_progress' | 'done'
    dueDate?: string | null
  }) {
    return taskRepository.create(input)
  },

  getTaskById(id: string) {
    const task = taskRepository.findById(id)

    if (!task) {
      throw new AppError(404, 'TASK_NOT_FOUND', 'Task not found')
    }

    return task
  },

  updateTask(
    id: string,
    input: {
      title?: string
      description?: string | null
      status?: 'todo' | 'in_progress' | 'done'
      dueDate?: string | null
    }
  ) {
    const task = taskRepository.update(id, input)

    if (!task) {
      throw new AppError(404, 'TASK_NOT_FOUND', 'Task not found')
    }

    return task
  },

  deleteTask(id: string) {
    const deleted = taskRepository.delete(id)

    if (!deleted) {
      throw new AppError(404, 'TASK_NOT_FOUND', 'Task not found')
    }

    return { success: true }
  },

  listTasks(params: TaskListParams) {
    const cursorData = params.cursor ? decodeCursor(params.cursor) : undefined

    const repoParams: {
      status?: 'todo' | 'in_progress' | 'done'
      search?: string
      sortBy: 'createdAt' | 'dueDate' | 'title'
      sortOrder: 'asc' | 'desc'
      limit: number
      cursorData?: { createdAt: string; id: string }
    } = {
      sortBy: params.sortBy ?? 'createdAt',
      sortOrder: params.sortOrder ?? 'desc',
      limit: params.limit + 1,
    }

    if (params.status !== undefined) {
      repoParams.status = params.status
    }

    if (params.search !== undefined) {
      repoParams.search = params.search
    }

    if (cursorData !== undefined) {
      repoParams.cursorData = cursorData
    }

    const tasks = taskRepository.list(repoParams)

    const hasMore = tasks.length > params.limit
    const items = hasMore ? tasks.slice(0, params.limit) : tasks

    const lastItem = items[items.length - 1]

    const nextCursor =
      hasMore && lastItem && (params.sortBy ?? 'createdAt') === 'createdAt'
        ? encodeCursor({
            createdAt: lastItem.createdAt,
            id: lastItem.id,
          })
        : null

    return {
      data: items,
      pageInfo: {
        nextCursor,
        hasMore,
      },
    }
  },
}
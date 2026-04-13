import { Hono } from 'hono'
import {
  createTaskSchema,
  taskListQuerySchema,
  updateTaskSchema,
} from '../schemas/task.schema'
import { taskService } from '../services/task.service'
import { AppError } from '../types/error.types'
import type { TaskListParams } from '../types/task.types'

export const tasksRoute = new Hono()

tasksRoute.get('/', (c) => {
  const parsed = taskListQuerySchema.safeParse(c.req.query())

  if (!parsed.success) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Invalid query parameters', {
      issues: parsed.error.flatten(),
    })
  }

  const query: TaskListParams = {
    sortBy: parsed.data.sortBy,
    sortOrder: parsed.data.sortOrder,
    limit: parsed.data.limit,
  }

  if (parsed.data.status !== undefined) {
    query.status = parsed.data.status
  }

  if (parsed.data.search !== undefined) {
    query.search = parsed.data.search
  }

  if (parsed.data.cursor !== undefined) {
    query.cursor = parsed.data.cursor
  }

  const result = taskService.listTasks(query)

  return c.json(result)
})

tasksRoute.get('/:id', (c) => {
  const id = c.req.param('id')
  const task = taskService.getTaskById(id)

  return c.json(task)
})

tasksRoute.post('/', async (c) => {
  const body = await c.req.json()
  const parsed = createTaskSchema.safeParse(body)

  if (!parsed.success) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Invalid request body', {
      issues: parsed.error.flatten(),
    })
  }

  const createData: {
    title: string
    description?: string | null
    status: 'todo' | 'in_progress' | 'done'
    dueDate?: string | null
  } = {
    title: parsed.data.title,
    status: parsed.data.status,
  }

  if (parsed.data.description !== undefined) {
    createData.description = parsed.data.description
  }

  if (parsed.data.dueDate !== undefined) {
    createData.dueDate = parsed.data.dueDate
  }

  const task = taskService.createTask(createData)

  return c.json(task, 201)
})

tasksRoute.put('/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  const parsed = updateTaskSchema.safeParse(body)

  if (!parsed.success) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Invalid request body', {
      issues: parsed.error.flatten(),
    })
  }

  const updateData: {
    title?: string
    description?: string | null
    status?: 'todo' | 'in_progress' | 'done'
    dueDate?: string | null
  } = {}

  if (parsed.data.title !== undefined) {
    updateData.title = parsed.data.title
  }

  if (parsed.data.description !== undefined) {
    updateData.description = parsed.data.description
  }

  if (parsed.data.status !== undefined) {
    updateData.status = parsed.data.status
  }

  if (parsed.data.dueDate !== undefined) {
    updateData.dueDate = parsed.data.dueDate
  }

  const task = taskService.updateTask(id, updateData)

  return c.json(task)
})
tasksRoute.delete('/:id', (c) => {
  const id = c.req.param('id')
  const result = taskService.deleteTask(id)

  return c.json(result)
})
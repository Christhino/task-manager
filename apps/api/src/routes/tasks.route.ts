import { Hono } from 'hono'
import { swaggerUI } from '@hono/swagger-ui'
import {
  createTaskSchema,
  taskListQuerySchema,
  updateTaskSchema,
} from '../schemas/task.schema'
import { taskService } from '../services/task.service'
import { AppError } from '../types/error.types'
import type { TaskListParams } from '../types/task.types'

export const tasksRoute = new Hono()

const tasksOpenApiDoc = {
  openapi: '3.0.0',
  info: {
    title: 'Tasks API',
    version: '1.0.0',
    description: 'API documentation for the task management prototype',
  },
  servers: [
    {
      url: 'http://localhost:3000',
    },
  ],
  paths: {
    '/tasks': {
      get: {
        summary: 'List tasks',
        description: 'Returns tasks with optional filtering, search, sorting and cursor pagination.',
        parameters: [
          {
            in: 'query',
            name: 'status',
            schema: {
              type: 'string',
              enum: ['todo', 'in_progress', 'done'],
            },
          },
          {
            in: 'query',
            name: 'search',
            schema: {
              type: 'string',
            },
          },
          {
            in: 'query',
            name: 'sortBy',
            schema: {
              type: 'string',
              enum: ['createdAt', 'dueDate', 'title'],
              default: 'createdAt',
            },
          },
          {
            in: 'query',
            name: 'sortOrder',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
          },
          {
            in: 'query',
            name: 'limit',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 50,
              default: 10,
            },
          },
          {
            in: 'query',
            name: 'cursor',
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Tasks retrieved successfully',
          },
          '400': {
            description: 'Invalid query parameters',
          },
        },
      },
      post: {
        summary: 'Create a task',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title'],
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string', nullable: true },
                  status: {
                    type: 'string',
                    enum: ['todo', 'in_progress', 'done'],
                    default: 'todo',
                  },
                  dueDate: {
                    type: 'string',
                    format: 'date-time',
                    nullable: true,
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Task created successfully',
          },
          '400': {
            description: 'Invalid request body',
          },
        },
      },
    },
    '/tasks/{id}': {
      get: {
        summary: 'Get a task by id',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Task retrieved successfully',
          },
          '404': {
            description: 'Task not found',
          },
        },
      },
      put: {
        summary: 'Update a task',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string', nullable: true },
                  status: {
                    type: 'string',
                    enum: ['todo', 'in_progress', 'done'],
                  },
                  dueDate: {
                    type: 'string',
                    format: 'date-time',
                    nullable: true,
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Task updated successfully',
          },
          '400': {
            description: 'Invalid request body',
          },
          '404': {
            description: 'Task not found',
          },
        },
      },
      delete: {
        summary: 'Delete a task',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Task deleted successfully',
          },
          '404': {
            description: 'Task not found',
          },
        },
      },
    },
  },
}

tasksRoute.get('/openapi.json', (c) => {
  return c.json(tasksOpenApiDoc)
})

tasksRoute.get(
  '/swagger',
  swaggerUI({
    url: '/tasks/openapi.json',
  })
)

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
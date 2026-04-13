import { z } from 'zod'

export const taskStatusSchema = z.enum(['todo', 'in_progress', 'done'])

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  description: z.string().trim().max(2000).optional().nullable(),
  status: taskStatusSchema.default('todo'),
  dueDate: z.string().datetime().optional().nullable(),
})

export const updateTaskSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().max(2000).optional().nullable(),
  status: taskStatusSchema.optional(),
  dueDate: z.string().datetime().optional().nullable(),
})

export const taskListQuerySchema = z.object({
  status: taskStatusSchema.optional(),
  search: z.string().trim().optional(),
  sortBy: z.enum(['createdAt', 'dueDate', 'title']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  cursor: z.string().optional(),
})
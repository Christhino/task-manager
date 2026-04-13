export type TaskStatus = 'todo' | 'in_progress' | 'done'

export type Task = {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  dueDate: string | null
  createdAt: string
  updatedAt: string
}

export type TaskListParams = {
  status?: TaskStatus
  search?: string
  sortBy?: 'createdAt' | 'dueDate' | 'title'
  sortOrder?: 'asc' | 'desc'
  limit: number
  cursor?: string
}

export type TaskCursorPayload = {
  createdAt: string
  id: string
}
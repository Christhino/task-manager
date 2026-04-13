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

export type TasksResponse = {
  data: Task[]
  pageInfo: {
    nextCursor: string | null
    hasMore: boolean
  }
}

export type TaskListParams = {
  status?: TaskStatus
  search?: string
  sortBy?: 'createdAt' | 'dueDate' | 'title'
  sortOrder?: 'asc' | 'desc'
  limit?: number
  cursor?: string
}

export type CreateTaskInput = {
  title: string
  description?: string | null
  status?: TaskStatus
  dueDate?: string | null
}

export type UpdateTaskInput = {
  title?: string
  description?: string | null
  status?: TaskStatus
  dueDate?: string | null
}
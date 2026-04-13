import axios from 'axios'
import type {
  CreateTaskInput,
  Task,
  TaskListParams,
  TasksResponse,
  UpdateTaskInput,
} from '../types/task'

const api = axios.create({
  baseURL: 'http://localhost:3000',
})

export async function getTasks(params: TaskListParams): Promise<TasksResponse> {
  const response = await api.get('/tasks', { params })
  return response.data
}

export async function getTaskById(id: string): Promise<Task> {
  const response = await api.get(`/tasks/${id}`)
  return response.data
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const response = await api.post('/tasks', input)
  return response.data
}

export async function updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
  const response = await api.put(`/tasks/${id}`, input)
  return response.data
}

export async function deleteTask(id: string): Promise<{ success: true }> {
  const response = await api.delete(`/tasks/${id}`)
  return response.data
}
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createTask, deleteTask, getTasks, updateTask } from '../api/tasks'
import type { CreateTaskInput, TaskListParams, UpdateTaskInput } from '../types/task'

export function useTasks(filters: Omit<TaskListParams, 'cursor'>) {
  return useInfiniteQuery({
    queryKey: ['tasks', filters],
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) =>
      getTasks({
        ...filters,
        cursor: pageParam ?? undefined,
      }),
    getNextPageParam: (lastPage) => lastPage.pageInfo.nextCursor,
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateTaskInput) => createTask(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTaskInput }) =>
      updateTask(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}
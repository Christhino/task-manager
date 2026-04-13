import { useState } from 'react'
import { useCreateTask } from '../hooks/useTasks'
import type { TaskStatus } from '../types/task'

export function TaskForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<TaskStatus>('todo')

  const createTaskMutation = useCreateTask()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return

    createTaskMutation.mutate(
      {
        title: title.trim(),
        description: description.trim() || null,
        status,
      },
      {
        onSuccess: () => {
          setTitle('')
          setDescription('')
          setStatus('todo')
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2>Create task</h2>

      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
        <option value="todo">Todo</option>
        <option value="in_progress">In progress</option>
        <option value="done">Done</option>
      </select>

      <button type="submit" disabled={createTaskMutation.isPending}>
        {createTaskMutation.isPending ? 'Creating...' : 'Create'}
      </button>
    </form>
  )
}
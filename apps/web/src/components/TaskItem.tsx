import { useDeleteTask, useUpdateTask } from '../hooks/useTasks'
import type { Task, TaskStatus } from '../types/task'

type Props = {
  task: Task
}

export function TaskItem({ task }: Props) {
  const updateTaskMutation = useUpdateTask()
  const deleteTaskMutation = useDeleteTask()

  const handleStatusChange = (status: TaskStatus) => {
    updateTaskMutation.mutate({
      id: task.id,
      input: { status },
    })
  }

  const handleDelete = () => {
    deleteTaskMutation.mutate(task.id)
  }

  return (
    <div className="task-item">
      <div>
        <h3>{task.title}</h3>
        {task.description && <p>{task.description}</p>}
        <small>Status: {task.status}</small>
      </div>

      <div className="task-actions">
        <select
          value={task.status}
          onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
          disabled={updateTaskMutation.isPending}
        >
          <option value="todo">Todo</option>
          <option value="in_progress">In progress</option>
          <option value="done">Done</option>
        </select>

        <button onClick={handleDelete} disabled={deleteTaskMutation.isPending}>
          Delete
        </button>
      </div>
    </div>
  )
}
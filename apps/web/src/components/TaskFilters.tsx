import type { TaskStatus } from '../types/task'

type Props = {
  status: TaskStatus | ''
  search: string
  onStatusChange: (value: TaskStatus | '') => void
  onSearchChange: (value: string) => void
}

export function TaskFilters({
  status,
  search,
  onStatusChange,
  onSearchChange,
}: Props) {
  return (
    <div className="card">
      <h2>Filters</h2>

      <input
        type="text"
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <select value={status} onChange={(e) => onStatusChange(e.target.value as TaskStatus | '')}>
        <option value="">All statuses</option>
        <option value="todo">Todo</option>
        <option value="in_progress">In progress</option>
        <option value="done">Done</option>
      </select>
    </div>
  )
}
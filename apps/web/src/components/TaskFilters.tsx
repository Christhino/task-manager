import type { TaskStatus } from '../types/task'

type SortBy = 'createdAt' | 'dueDate' | 'title'
type SortOrder = 'asc' | 'desc'

type Props = {
  status: TaskStatus | ''
  search: string
  sortBy: SortBy
  sortOrder: SortOrder
  onStatusChange: (value: TaskStatus | '') => void
  onSearchChange: (value: string) => void
  onSortByChange: (value: SortBy) => void
  onSortOrderChange: (value: SortOrder) => void
}

export function TaskFilters({
  status,
  search,
  sortBy,
  sortOrder,
  onStatusChange,
  onSearchChange,
  onSortByChange,
  onSortOrderChange,
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

      {/* 🔥 SORT BY */}
      <select value={sortBy} onChange={(e) => onSortByChange(e.target.value as SortBy)}>
        <option value="createdAt">Created date</option>
        <option value="dueDate">Due date</option>
        <option value="title">Title</option>
      </select>

      {/* 🔥 ORDER */}
      <select value={sortOrder} onChange={(e) => onSortOrderChange(e.target.value as SortOrder)}>
        <option value="desc">Descending</option>
        <option value="asc">Ascending</option>
      </select>
    </div>
  )
}
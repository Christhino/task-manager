import { TaskItem } from './TaskItem'
import { useTasks } from '../hooks/useTasks'
import type { TaskStatus } from '../types/task'

type Props = {
  status: TaskStatus | ''
  search: string
}

export function TaskList({ status, search }: Props) {
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useTasks({
    status: status || undefined,
    search: search || undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    limit: 5,
  })

  const tasks = data?.pages.flatMap((page) => page.data) ?? []

  if (isLoading) {
    return <div className="card">Loading tasks...</div>
  }

  if (isError) {
    return <div className="card">An error occurred while loading tasks.</div>
  }

  return (
    <div className="card">
      <h2>Tasks</h2>

      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}

      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? 'Loading more...' : 'Load more'}
        </button>
      )}
    </div>
  )
}
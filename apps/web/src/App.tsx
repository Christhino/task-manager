import { useState } from 'react'
import { TaskFilters } from './components/TaskFilters'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import type { TaskStatus } from './types/task'

function App() {
  const [status, setStatus] = useState<TaskStatus | ''>('')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'createdAt' | 'dueDate' | 'title'>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  return (
    <main className="container">
      <h1>Task Manager</h1>
      <TaskForm />
      <TaskFilters
        status={status}
        search={search}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onStatusChange={setStatus}
        onSearchChange={setSearch}
        onSortByChange={setSortBy}
        onSortOrderChange={setSortOrder}
      />

      <TaskList
        status={status}
        search={search}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />
    </main>
  )
}

export default App
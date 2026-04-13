import { useState } from 'react'
import { TaskFilters } from './components/TaskFilters'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import type { TaskStatus } from './types/task'

function App() {
  const [status, setStatus] = useState<TaskStatus | ''>('')
  const [search, setSearch] = useState('')

  return (
    <main className="container">
      <h1>Task Manager</h1>
      <TaskForm />
      <TaskFilters
        status={status}
        search={search}
        onStatusChange={setStatus}
        onSearchChange={setSearch}
      />
      <TaskList status={status} search={search} />
    </main>
  )
}

export default App
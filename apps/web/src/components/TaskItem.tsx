import { useEffect, useState } from 'react'
import { useDeleteTask, useUpdateTask } from '../hooks/useTasks'
import type { Task, TaskStatus } from '../types/task'

type Props = {
  task: Task
}

export function TaskItem({ task }: Props) {
  const updateTaskMutation = useUpdateTask()
  const deleteTaskMutation = useDeleteTask()

  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditingDescription, setIsEditingDescription] = useState(false)

  const [titleDraft, setTitleDraft] = useState(task.title)
  const [descriptionDraft, setDescriptionDraft] = useState(task.description ?? '')

  useEffect(() => {
    setTitleDraft(task.title)
    setDescriptionDraft(task.description ?? '')
  }, [task.title, task.description])

  const handleStatusChange = (status: TaskStatus) => {
    updateTaskMutation.mutate({
      id: task.id,
      input: { status },
    })
  }

  const handleDelete = () => {
    deleteTaskMutation.mutate(task.id)
  }

  const saveTitle = () => {
    const nextTitle = titleDraft.trim()

    setIsEditingTitle(false)

    if (!nextTitle || nextTitle === task.title) {
      setTitleDraft(task.title)
      return
    }

    updateTaskMutation.mutate({
      id: task.id,
      input: { title: nextTitle },
    })
  }

  const saveDescription = () => {
    const nextDescription = descriptionDraft.trim()

    setIsEditingDescription(false)

    const normalized = nextDescription === '' ? null : nextDescription

    if (normalized === task.description) {
      return
    }

    updateTaskMutation.mutate({
      id: task.id,
      input: { description: normalized },
    })
  }

  return (
    <div className="task-item">
      <div>
        {isEditingTitle ? (
          <input
            className="inline-title-input"
            autoFocus
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                saveTitle()
              }
              if (e.key === 'Escape') {
                setTitleDraft(task.title)
                setIsEditingTitle(false)
              }
            }}
          />
        ) : (
          <h3 className="editable-title" onClick={() => setIsEditingTitle(true)}>
            {task.title}
          </h3>
        )}

        {isEditingDescription ? (
          <textarea
            className="inline-description-input"
            autoFocus
            value={descriptionDraft}
            onChange={(e) => setDescriptionDraft(e.target.value)}
            onBlur={saveDescription}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setDescriptionDraft(task.description ?? '')
                setIsEditingDescription(false)
              }
            }}
          />
        ) : (
          <p
            className="editable-description"
            onClick={() => setIsEditingDescription(true)}
          >
            {task.description || 'Click here to add a description'}
          </p>
        )}

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
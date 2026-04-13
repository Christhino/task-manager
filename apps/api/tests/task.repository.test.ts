import { beforeEach, describe, expect, it } from 'vitest'
import Database from 'better-sqlite3'
import { taskRepository } from '../src/db/task.repository'

const db = new Database('tasks.db')

describe('task.repository', () => {
  beforeEach(() => {
    db.prepare('DELETE FROM tasks').run()
  })

  it('should filter tasks by status', () => {
    taskRepository.create({
      title: 'Todo task',
      status: 'todo',
    })

    taskRepository.create({
      title: 'Done task',
      status: 'done',
    })

    const result = taskRepository.list({
      status: 'todo',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      limit: 10,
    })

    expect(result).toHaveLength(1)

    const firstTask = result[0]
    expect(firstTask).toBeDefined()

    if (!firstTask) {
    throw new Error('Expected firstTask to be defined')
    }

    expect(firstTask.title).toBe('Todo task')
    expect(firstTask.status).toBe('todo')
  })

  it('should search tasks by title/description', () => {
    taskRepository.create({
      title: 'Design homepage',
      description: 'Landing page improvements',
      status: 'todo',
    })

    taskRepository.create({
      title: 'Fix API bug',
      description: 'Backend pagination issue',
      status: 'done',
    })

    const result = taskRepository.list({
      search: 'Design',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      limit: 10,
    })

    expect(result).toHaveLength(1)

    const firstTask = result[0]
    expect(firstTask).toBeDefined()

    if (!firstTask) {
    throw new Error('Expected firstTask to be defined')
    }

    expect(firstTask.title).toBe('Design homepage')
  })

  it('should paginate tasks with cursor on createdAt', () => {
    const task1 = taskRepository.create({
      title: 'Task 1',
      status: 'todo',
    })

    const task2 = taskRepository.create({
      title: 'Task 2',
      status: 'todo',
    })

    const task3 = taskRepository.create({
      title: 'Task 3',
      status: 'todo',
    })

    const firstPage = taskRepository.list({
      sortBy: 'createdAt',
      sortOrder: 'desc',
      limit: 2,
    })

    expect(firstPage).toHaveLength(2)

    const lastItem = firstPage[1]
    expect(lastItem).toBeDefined()

    if (!lastItem) {
    throw new Error('Expected lastItem to be defined')
    }

    const secondPage = taskRepository.list({
    sortBy: 'createdAt',
    sortOrder: 'desc',
    limit: 2,
    cursorData: {
        createdAt: lastItem.createdAt,
        id: lastItem.id,
    },
    })

    expect(secondPage.length).toBeGreaterThanOrEqual(1)

    const firstPageIds = firstPage.map((task) => task.id)
    const secondPageIds = secondPage.map((task) => task.id)

    for (const id of secondPageIds) {
      expect(firstPageIds).not.toContain(id)
    }

    function assertDefined<T>(value: T | undefined): T {
        if (value === undefined) {
            throw new Error('Expected value to be defined')
        }
        return value 
    }
    const firstTask = assertDefined(secondPage[0])

expect([task1.id, task2.id, task3.id]).toContain(firstTask.id)
  })
})
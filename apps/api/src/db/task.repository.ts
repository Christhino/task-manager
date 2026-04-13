import Database from 'better-sqlite3'
import { randomUUID } from 'node:crypto'
import type { Task, TaskListParams } from '../types/task.types.js'

const db = new Database('tasks.db')

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL,
    dueDate TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  )
`)

function mapRowToTask(row: Record<string, unknown>): Task {
  return {
    id: String(row.id),
    title: String(row.title),
    description: row.description ? String(row.description) : null,
    status: row.status as Task['status'],
    dueDate: row.dueDate ? String(row.dueDate) : null,
    createdAt: String(row.createdAt),
    updatedAt: String(row.updatedAt),
  }
}

export const taskRepository = {
  create(input: {
    title: string
    description?: string | null
    status: Task['status']
    dueDate?: string | null
  }): Task {
    const id = randomUUID()
    const now = new Date().toISOString()

    db.prepare(`
      INSERT INTO tasks (id, title, description, status, dueDate, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      input.title,
      input.description ?? null,
      input.status,
      input.dueDate ?? null,
      now,
      now
    )

    return {
      id,
      title: input.title,
      description: input.description ?? null,
      status: input.status,
      dueDate: input.dueDate ?? null,
      createdAt: now,
      updatedAt: now,
    }
  },

  findById(id: string): Task | null {
    const row = db.prepare(`SELECT * FROM tasks WHERE id = ?`).get(id) as
      | Record<string, unknown>
      | undefined

    if (!row) return null
    return mapRowToTask(row)
  },

  update(
    id: string,
    input: {
      title?: string
      description?: string | null
      status?: Task['status']
      dueDate?: string | null
    }
  ): Task | null {
    const existing = this.findById(id)
    if (!existing) return null

    const updated: Task = {
      ...existing,
      title: input.title ?? existing.title,
      description:
        input.description !== undefined ? input.description : existing.description,
      status: input.status ?? existing.status,
      dueDate: input.dueDate !== undefined ? input.dueDate : existing.dueDate,
      updatedAt: new Date().toISOString(),
    }

    db.prepare(`
      UPDATE tasks
      SET title = ?, description = ?, status = ?, dueDate = ?, updatedAt = ?
      WHERE id = ?
    `).run(
      updated.title,
      updated.description,
      updated.status,
      updated.dueDate,
      updated.updatedAt,
      id
    )

    return updated
  },

  delete(id: string): boolean {
    const result = db.prepare(`DELETE FROM tasks WHERE id = ?`).run(id)
    return result.changes > 0
  },

  list(params: {
    status?: string
    search?: string
    sortBy: 'createdAt' | 'dueDate' | 'title'
    sortOrder: 'asc' | 'desc'
    limit: number
    cursorData?: { createdAt: string; id: string }
  }): Task[] {
    const conditions: string[] = []
    const values: Array<string | number> = []

    if (params.status) {
      conditions.push(`status = ?`)
      values.push(params.status)
    }

    if (params.search) {
      conditions.push(`(title LIKE ? OR description LIKE ?)`)
      values.push(`%${params.search}%`, `%${params.search}%`)
    }

    if (params.cursorData && params.sortBy === 'createdAt') {
      const operator = params.sortOrder === 'desc' ? '<' : '>'
      conditions.push(`(createdAt ${operator} ? OR (createdAt = ? AND id ${operator} ?))`)
      values.push(
        params.cursorData.createdAt,
        params.cursorData.createdAt,
        params.cursorData.id
      )
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

    const query = `
      SELECT *
      FROM tasks
      ${whereClause}
      ORDER BY ${params.sortBy} ${params.sortOrder.toUpperCase()}, id ${params.sortOrder.toUpperCase()}
      LIMIT ?
    `

    values.push(params.limit)

    const rows = db.prepare(query).all(...values) as Record<string, unknown>[]

    return rows.map(mapRowToTask)
  },
}
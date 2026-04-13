import Database from 'better-sqlite3'
import type { Database as SQLiteDB } from 'better-sqlite3'

export function createDb(filename: string = 'tasks.db'): SQLiteDB {
  const db = new Database(filename)

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

  return db
}
// export function getDb() {
//   return db
// }
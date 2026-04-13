import Database from 'better-sqlite3'

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

// export function getDb() {
//   return db
// }
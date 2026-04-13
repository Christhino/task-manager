import { Hono } from 'hono'
import { tasksRoute } from './routes/tasks.route'
import { errorMiddleware } from './middleware/error.middleware'
import { createDb } from './db/database'
import type Database from 'better-sqlite3'

type AppBindings = {
  Variables: {
    db: Database.Database
  }
}

export function createApp(db: Database.Database = createDb()) {
  const app = new Hono<AppBindings>()

  app.use('*', async (c, next) => {
    c.set('db', db)
    await next()
  })

  app.get('/', (c) => c.json({ message: 'Task API is running' }))
  app.route('/tasks', tasksRoute)

  app.onError(errorMiddleware)

  return app
}
import { Hono } from 'hono'
import { tasksRoute } from './routes/tasks.route.js'
import { errorMiddleware } from './middleware/error.middleware.js'

export function createApp() {
  const app = new Hono()

  app.get('/', (c) => c.json({ message: 'Task API is running' }))
  app.route('/tasks', tasksRoute)

  app.onError(errorMiddleware)

  return app
}
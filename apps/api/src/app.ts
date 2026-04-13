import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { tasksRoute } from './routes/tasks.route.js'
import { errorMiddleware } from './middleware/error.middleware.js'

export function createApp() {
  const app = new Hono()

  app.use(
    '*',
    cors({
      origin: 'http://localhost:5173',
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization'],
    })
  )

  app.get('/', (c) => c.json({ message: 'Task API is running' }))
  app.route('/tasks', tasksRoute)

  app.onError(errorMiddleware)

  return app
}
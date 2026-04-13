import { serve } from '@hono/node-server'
import { createApp } from './app'

const app = createApp()

serve({
  fetch: app.fetch,
  port: 3000
})

console.log('API running on http://localhost:3000')
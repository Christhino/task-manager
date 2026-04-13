import { describe, expect, it } from 'vitest'
import { createApp } from '../src/app'

describe('tasks.route', () => {
  const app = createApp()

  it('should return 201 when creating a valid task', async () => {
    const response = await app.request('/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Write tests',
        status: 'todo',
      }),
    })

    expect(response.status).toBe(201)

    const body = await response.json()

    expect(body.title).toBe('Write tests')
    expect(body.status).toBe('todo')
    expect(body.id).toBeDefined()
  })

  it('should return 400 when creating an invalid task', async () => {
    const response = await app.request('/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })

    expect(response.status).toBe(400)

    const body = await response.json()

    expect(body.error).toBeDefined()
    expect(body.error.code).toBe('VALIDATION_ERROR')
  })

  it('should return 200 for GET /tasks', async () => {
    const response = await app.request('/tasks')

    expect(response.status).toBe(200)

    const body = await response.json()

    expect(Array.isArray(body.data)).toBe(true)
    expect(body.pageInfo).toBeDefined()
  })

  it('should return 400 for invalid query params', async () => {
    const response = await app.request('/tasks?limit=0')

    expect(response.status).toBe(400)

    const body = await response.json()

    expect(body.error).toBeDefined()
    expect(body.error.code).toBe('VALIDATION_ERROR')
  })
})
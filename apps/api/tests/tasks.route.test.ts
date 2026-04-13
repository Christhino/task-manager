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

  it('should return 200 for GET /tasks/:id', async () => {
    const createResponse = await app.request('/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Task to fetch',
        status: 'todo',
      }),
    })

    const createdTask = await createResponse.json()

    const response = await app.request(`/tasks/${createdTask.id}`)

    expect(response.status).toBe(200)

    const body = await response.json()

    expect(body.id).toBe(createdTask.id)
    expect(body.title).toBe('Task to fetch')
  })

  it('should return 404 for GET /tasks/:id when task does not exist', async () => {
    const response = await app.request('/tasks/unknown-id')

    expect(response.status).toBe(404)

    const body = await response.json()

    expect(body.error.code).toBe('TASK_NOT_FOUND')
  })

  it('should return 200 for PUT /tasks/:id', async () => {
    const createResponse = await app.request('/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Task to update',
        status: 'todo',
      }),
    })

    const createdTask = await createResponse.json()

    const response = await app.request(`/tasks/${createdTask.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'done',
        title: 'Task updated',
      }),
    })

    expect(response.status).toBe(200)

    const body = await response.json()

    expect(body.id).toBe(createdTask.id)
    expect(body.status).toBe('done')
    expect(body.title).toBe('Task updated')
  })

  it('should return 404 for PUT /tasks/:id when task does not exist', async () => {
    const response = await app.request('/tasks/missing-id', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'done',
      }),
    })

    expect(response.status).toBe(404)

    const body = await response.json()

    expect(body.error.code).toBe('TASK_NOT_FOUND')
  })

  it('should return 200 for DELETE /tasks/:id', async () => {
    const createResponse = await app.request('/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Task to delete',
        status: 'todo',
      }),
    })

    const createdTask = await createResponse.json()

    const response = await app.request(`/tasks/${createdTask.id}`, {
      method: 'DELETE',
    })

    expect(response.status).toBe(200)

    const body = await response.json()

    expect(body).toEqual({ success: true })
  })

  it('should return 404 for DELETE /tasks/:id when task does not exist', async () => {
    const response = await app.request('/tasks/missing-id', {
      method: 'DELETE',
    })

    expect(response.status).toBe(404)

    const body = await response.json()

    expect(body.error.code).toBe('TASK_NOT_FOUND')
  })
})
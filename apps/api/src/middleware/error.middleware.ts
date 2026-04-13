export const errorMiddleware = (err: any, c: any) => {
  return c.json(
    {
      error: {
        code: err.code || 'INTERNAL_ERROR',
        message: err.message || 'Something went wrong',
        details: err.details || {}
      }
    },
    err.status || 500
  )
}
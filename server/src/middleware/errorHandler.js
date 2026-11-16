export function notFound(req, res) {
  return res.status(404).json({
    success: false,
    message: 'API route not found: ' + req.method + ' ' + req.originalUrl,
  })
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error)

  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({ success: false, message: 'The request body contains invalid JSON.' })
  }

  if (error.message?.includes('CORS')) {
    return res.status(403).json({ success: false, message: 'This website origin is not allowed.' })
  }

  if (error.code === 11000) {
    const fields = Object.keys(error.keyPattern || {})
    return res.status(409).json({
      success: false,
      message: fields.length ? fields.join(', ') + ' already exists.' : 'A record with this information already exists.',
    })
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Database validation failed.',
      errors: Object.values(error.errors).map((item) => item.message),
    })
  }

  if (error.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'The supplied record ID is invalid.' })
  }

  console.error(error)
  return res.status(error.statusCode || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'An unexpected server error occurred.' : error.message || 'An unexpected server error occurred.',
  })
}

export function validate(schema) {
  return function validateRequest(req, res, next) {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Please check the submitted information.',
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      })
    }
    req.body = result.data
    return next()
  }
}

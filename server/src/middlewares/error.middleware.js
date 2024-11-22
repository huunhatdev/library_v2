const errorMiddleware = (err, req, res, _next) => {
  console.error('[This bug ==>]', err.message)
  if (err?.code === 11000) {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      message: 'Duplicate key error',
      errors: err.keyValue
    })
  }
  if (!err.statusCode || err.statusCode === 500) {
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: 'Something went wrong'
    })
  }
  return res
    .status(err.statusCode)
    .json({ statusCode: err.statusCode, success: false, message: err.message })
}

module.exports = { errorMiddleware }

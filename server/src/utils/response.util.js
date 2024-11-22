const responseUtil = ({ res, message = 'Success', data }) => {
  return res.status(200).json({
    success: true,
    message,
    data
  })
}

module.exports = {
  responseUtil
}

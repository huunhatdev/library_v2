const Authentication = require('./authentication.middleware')

module.exports = {
  authMiddleware: new Authentication()
}

const ApiError = require('../error/ApiError')
const tokenService = require('../service/token-service')

module.exports = function (role) {
  return function (req, res, next) {
    try {
      const authorizationHeader = req.headers.authorization
      if (!authorizationHeader) {
        return next(ApiError.unAuthorizedError())
      }

      const accessToken = authorizationHeader.split(' ')[1]
      if (!accessToken) {
        return next(ApiError.unAuthorizedError())
      }

      const userData = tokenService.validateAccessToken(accessToken)
      if (!userData) {
        return next(ApiError.unAuthorizedError())
      }
      console.log(userData)
      if (userData.role !== role) {
        return next(ApiError.badRequest('Нет доступа'))
      }
      req.user = userData
      next()
    } catch (error) {
      return next(ApiError.unAuthorizedError())
    }
  }
}

import { Request, Response, NextFunction } from 'express'
import ApiError from '../error/ApiError'
import tokenService from '../service/token-service'


const checkRole = function (role: string) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const authorizationHeader = req.headers.authorization
      if (!authorizationHeader) {
        return next(ApiError.unAuthorizedError())
      }

      const accessToken = authorizationHeader.split(' ')[1]
      if (!accessToken) {
        return next(ApiError.unAuthorizedError())
      }

      const userData = await tokenService.validateAccessToken(accessToken)
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

export default checkRole
import { Request, Response, NextFunction } from 'express'
import ApiError from '../error/ApiError'
import tokenService from '../service/token-service'

export default async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
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
    req.user = userData
    next()
  } catch (error) {
    return next(ApiError.unAuthorizedError())
  }
}

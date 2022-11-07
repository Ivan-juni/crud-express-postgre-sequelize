import { Request, Response, NextFunction } from 'express'
import userService from '../service/user-service'
import { validationResult } from 'express-validator'
import ApiError from '../error/ApiError'

export interface IUser {
  email: string,
  password: string,
  role?: string
}

class UserController {
  static async registration(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(ApiError.badRequest('Ошибка при валидации'))
      }
      // достаем введенные пользователем данные
      const { email, password, role }: IUser = req.body
      const userData = await userService.registration(email, password, role)

      // храним refreshToken в куках
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true, // чтобы нельзя было получить/изменить внутри браузера
      })

      return res.json(userData)
    } catch (error) {
      next(error)
    }
  }
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password }: IUser = req.body
      const userData = await userService.login(email, password)
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })

      return res.json(userData)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      // достаем из кукис refreshToken
      const { refreshToken }: {refreshToken: string} = req.cookies
      const token = await userService.logout(refreshToken)
      // удаляем refreshToken из кукис
      res.clearCookie('refreshToken')
      if (token === 1) {
        return res.json({message: 'Logout successfully'})
      }
      else {
        return res.json({message: 'Sth goes wrong...'})
      }
    } catch (error) {
      next(error)
    }
  }
  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      // достаем из кукис refreshToken
      const { refreshToken }: {refreshToken: string} = req.cookies

      // обновляем refreshToken
      const userData = await userService.refresh(refreshToken)
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })

      return res.json(userData)
    } catch (error) {
      next(error)
    }
  }
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAllUsers()
      return res.json(users)
    } catch (error) {
      return next(error)
    }
  }
  static async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      if (!id) {
        next(ApiError.badRequest("User id wasn't typed"))
      }
      const users = await userService.getOneUser(+id)
      return res.json(users)
    } catch (error) {
      return next(error)
    }
  }
  static async deleteOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      if (!id) {
        next(ApiError.badRequest("User id wasn't typed"))
      }
      const users = await userService.deleteUser(+id)
      return res.json(users)
    } catch (error) {
      return next(error)
    }
  }
}

export default UserController

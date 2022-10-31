const userService = require('../service/user-service')
const { validationResult } = require('express-validator')
const ApiError = require('../error/ApiError')

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(ApiError.badRequest('Ошибка при валидации'))
      }
      const { email, password, role } = req.body
      const userData = await userService.registration(email, password, role)
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })

      return res.json(userData)
    } catch (error) {
      next(error)
    }
  }
  async login(req, res, next) {
    try {
      const { email, password } = req.body
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
  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const token = await userService.logout(refreshToken)
      res.clearCookie('refreshToken')
      return res.json(token)
    } catch (error) {
      next(error)
    }
  }
  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies

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
  async getAll(req, res, next) {
    try {
      const users = await userService.getAllUsers()
      return res.json(users)
    } catch (error) {
      return next(error)
    }
  }
  async getOne(req, res, next) {
    try {
      const { id } = req.params
      if (!id) {
        next(ApiError.badRequest("User id wasn't typed"))
      }
      const users = await userService.getOneUser(id)
      return res.json(users)
    } catch (error) {
      return next(error)
    }
  }
  async deleteOne(req, res, next) {
    try {
      const { id } = req.params
      if (!id) {
        next(ApiError.badRequest("User id wasn't typed"))
      }
      const users = await userService.deleteUser(id)
      return res.json(users)
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = new UserController()

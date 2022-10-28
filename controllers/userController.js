const { User } = require('../models/models')
const UserService = require('../service/user-service')
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
      const userData = await UserService.registration(email, password, role)
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
    } catch (error) {
      next(error)
    }
  }
  async logout(req, res, next) {
    try {
    } catch (error) {
      next(error)
    }
  }
  async check(req, res, next) {
    try {
    } catch (error) {
      next(error)
    }
  }
  async refresh(req, res, next) {
    try {
    } catch (error) {
      next(error)
    }
  }
  // async changePassword(req, res, next) {}
  async getAll(req, res, next) {
    try {
      const users = await User.findAll()
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
      const users = await User.findOne({ where: { id: id } })
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
      const users = await await await User.destroy({
        where: {
          id: id,
        },
      })
      return res.json(users)
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = new UserController()

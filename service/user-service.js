const { User } = require('../models/models')
const tokenService = require('./token-service')
const UserDto = require('../dtos/user-dto')
const bcrypt = require('bcrypt')
const ApiError = require('../error/ApiError')

class UserService {
  async registration(email, password, role) {
    const candidate = await User.findOne({ where: { email: email } })

    if (candidate !== null) {
      throw ApiError.badRequest(
        `Пользователь с почтовым адресом ${email} уже существует`
      )
    }
    const hashPassword = await bcrypt.hash(password, 3)
    const user = await User.create({ email, password: hashPassword, role })

    const userDto = new UserDto(user) // email, id, ?role
    const tokens = await tokenService.generateTokens({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return { ...tokens, user: userDto }
  }
  async login(email, password) {
    const user = await User.findOne({ where: { email: email } })
    if (!user) {
      throw ApiError.badRequest(
        `Пользователя с почтовым адресом ${email} не существует`
      )
    }
    // сравниваем введенный пароль с захэшированным в базе данных
    const isPassEquals = await bcrypt.compare(password, user.password)
    if (!isPassEquals) {
      throw ApiError.badRequest(`Пароль неверный`)
    }
    const userDto = new UserDto(user) // email, id, ?role
    const tokens = await tokenService.generateTokens({ ...userDto })

    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return { ...tokens, user: userDto }
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken)
    return token
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.unAuthorizedError()
    }
    const userData = tokenService.validateRefreshToken(refreshToken)
    const tokenFromDb = await tokenService.findToken(refreshToken)

    if (!userData || !tokenFromDb) {
      throw ApiError.unAuthorizedError()
    }
    const user = await User.findOne({ where: { id } })
    const userDto = new UserDto(user) // email, id, ?role
    const tokens = await tokenService.generateTokens({ ...userDto })

    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return { ...tokens, user: userDto }
  }

  async getAllUsers() {
    const users = await User.findAll()

    return users
  }

  async getOneUser(id) {
    const users = await User.findOne({ where: { id } })

    return users
  }

  async deleteUser(id) {
    const users = await User.destroy({
      where: { id },
    })

    return users
  }
}

module.exports = new UserService()

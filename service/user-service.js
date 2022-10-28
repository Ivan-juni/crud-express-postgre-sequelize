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

    const userDto = new UserDto(user) // email, id
    const tokens = await tokenService.generateTokens({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return { ...tokens, user: userDto }
  }
}

module.exports = new UserService()

import { User } from '../models/models'
import tokenService from './token-service'
import UserDto from '../dtos/user-dto'
import bcrypt from 'bcrypt'
import ApiError from '../error/ApiError'

class UserService {
  static async registration(email: string, password: string, role: string) {
    // проверяем есть ли такой пользователь в базе
    const candidate = await User.findOne({ where: { email } })

    if (candidate !== null) {
      throw ApiError.badRequest(
        `Пользователь с почтовым адресом ${email} уже существует`
      )
    }
    //

    // хэшируем пароль
    const hashPassword = await bcrypt.hash(password, 3)
    //создаем пользователя
    const user = await User.create({ email, password: hashPassword, role })
    // создаем модель пользователя, чтобы передать в genereateTokens
    // туда нельзя передавать пароль и другую постороннюю ин-цию,
    // поэтому мы создаем  data transfer object (dto) c email, id, role
    const userDto = new UserDto(user) // email, id, role
    // генерируем пару токенов для пользователя
    const tokens = await tokenService.generateTokens({ ...userDto })
    // сохраняем refreshToken для пользователя в бд
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    // объект - accessToken, refreshToken + user: email, id, role
    return { ...tokens, user: userDto }
  }
  static async login(email: string, password: string) {
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

  static async logout(refreshToken: string) {
    // удаляем refreshToken из бд
    const token = await tokenService.removeToken(refreshToken)
    return token
  }

  static async refresh(refreshToken: string) {
    // если токена нет в куках, пользователь не авторизован
    if (!refreshToken) {
      throw ApiError.unAuthorizedError()
    }
    // валидируем токен (не подделан и годен)
    const userData = await tokenService.validateRefreshToken(refreshToken)

    // ищем токен в бд
    const tokenFromDb = await tokenService.findToken(refreshToken)

    if (!userData || !tokenFromDb) {
      throw ApiError.unAuthorizedError()
    }
    // получаем пользователя из бд (вдруг за это время
    // ин-ция про него изменилась и нужно зашить в токен новую
    const user = await User.findOne({ where: { id: userData.id } })
    const userDto = new UserDto(user) // email, id, role
    // генерируем свежую пару токенов для пользователя
    const tokens = await tokenService.generateTokens({ ...userDto })

    // сохраняем refreshToken пользователя в бд
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return { ...tokens, user: userDto }
  }

  static async getAllUsers() {
    const users = await User.findAll()

    return users
  }

  static async getOneUser(id: number) {
    const users = await User.findOne({ where: { id } })

    return users
  }

  static async deleteUser(id: number) {
    const users = await User.destroy({
      where: { id },
    })

    return users
  }
}

export default UserService

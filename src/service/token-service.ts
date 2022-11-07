import jwt from 'jsonwebtoken'
import { Token } from '../models/models'
import UserDto from '../dtos/user-dto';

class TokenService {
  static async generateTokens(payload: UserDto) {
    // генерируем пару токенов
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '30m',
    })
    // токен, который обновляет access token, когда мы заходим на сайт. Если не заходить 30 дней, нужно будет снова логиниттся
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '30d',
    })

    return {
      accessToken,
      refreshToken,
    }
  }

  static async validateAccessToken(token: string) {
    try {
      // получаем payload из токена после верефикации, который мы в него вшивали
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET) as unknown as UserDto
      return userData
    } catch (error) {
      return null
    }
  }

  static async validateRefreshToken(token: string) {
    try {
      // получаем payload из токена после верефикации, который мы в него вшивали
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET) as unknown as UserDto
      return userData
    } catch (error) {
      return null
    }
  }

  // сохраняем refresh token конкретного пользователя в бд
  // по одному пользователю - один токен
  // при логине на другом устройстве, вас выкинет с того, на котором вы залогинены
  static async saveToken(userId: number, refreshToken: string) {
    const tokenData = await Token.findOne({ where: {userId} })
    if (tokenData) {
      // перезаписываем refreshToken, если был старый
      tokenData.refreshToken = refreshToken
      return tokenData.save()
    }
    // создаем refreshToken, если его нет в бд для этого пользователя
    const token = await Token.create({ userId, refreshToken })
    return token
  }

  // удаляем refreshToken токен
  static async removeToken(refreshToken: string) {
    const tokenData = await Token.destroy({
      where: { refreshToken: refreshToken },
    })
    return tokenData
  }

  // ищем в бд refreshToken
  static async findToken(refreshToken: string) {
    const tokenData = await Token.findOne({
      where: { refreshToken },
    })
    return tokenData
  }
}
export default TokenService

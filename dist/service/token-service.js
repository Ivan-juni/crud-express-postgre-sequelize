"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models/models");
class TokenService {
    static generateTokens(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            // генерируем пару токенов
            const accessToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_ACCESS_SECRET, {
                expiresIn: '30m',
            });
            // токен, который обновляет access token, когда мы заходим на сайт. Если не заходить 30 дней, нужно будет снова логиниттся
            const refreshToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_REFRESH_SECRET, {
                expiresIn: '30d',
            });
            return {
                accessToken,
                refreshToken,
            };
        });
    }
    static validateAccessToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // получаем payload из токена после верефикации, который мы в него вшивали
                const userData = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
                return userData;
            }
            catch (error) {
                return null;
            }
        });
    }
    static validateRefreshToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // получаем payload из токена после верефикации, который мы в него вшивали
                const userData = jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
                return userData;
            }
            catch (error) {
                return null;
            }
        });
    }
    // сохраняем refresh token конкретного пользователя в бд
    // по одному пользователю - один токен
    // при логине на другом устройстве, вас выкинет с того, на котором вы залогинены
    static saveToken(userId, refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenData = yield models_1.Token.findOne({ where: { userId } });
            if (tokenData) {
                // перезаписываем refreshToken, если был старый
                tokenData.refreshToken = refreshToken;
                return tokenData.save();
            }
            // создаем refreshToken, если его нет в бд для этого пользователя
            const token = yield models_1.Token.create({ userId, refreshToken });
            return token;
        });
    }
    // удаляем refreshToken токен
    static removeToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenData = yield models_1.Token.destroy({
                where: { refreshToken: refreshToken },
            });
            return tokenData;
        });
    }
    // ищем в бд refreshToken
    static findToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenData = yield models_1.Token.findOne({
                where: { refreshToken },
            });
            return tokenData;
        });
    }
}
exports.default = TokenService;
//# sourceMappingURL=token-service.js.map
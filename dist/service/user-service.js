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
const models_1 = require("../models/models");
const token_service_1 = __importDefault(require("./token-service"));
const user_dto_1 = __importDefault(require("../dtos/user-dto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const ApiError_1 = __importDefault(require("../error/ApiError"));
class UserService {
    static registration(email, password, role) {
        return __awaiter(this, void 0, void 0, function* () {
            // проверяем есть ли такой пользователь в базе
            const candidate = yield models_1.User.findOne({ where: { email } });
            if (candidate !== null) {
                throw ApiError_1.default.badRequest(`Пользователь с почтовым адресом ${email} уже существует`);
            }
            //
            // хэшируем пароль
            const hashPassword = yield bcrypt_1.default.hash(password, 3);
            //создаем пользователя
            const user = yield models_1.User.create({ email, password: hashPassword, role });
            // создаем модель пользователя, чтобы передать в genereateTokens
            // туда нельзя передавать пароль и другую постороннюю ин-цию,
            // поэтому мы создаем  data transfer object (dto) c email, id, role
            const userDto = new user_dto_1.default(user); // email, id, role
            // генерируем пару токенов для пользователя
            const tokens = yield token_service_1.default.generateTokens(Object.assign({}, userDto));
            // сохраняем refreshToken для пользователя в бд
            yield token_service_1.default.saveToken(userDto.id, tokens.refreshToken);
            // объект - accessToken, refreshToken + user: email, id, role
            return Object.assign(Object.assign({}, tokens), { user: userDto });
        });
    }
    static login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.User.findOne({ where: { email: email } });
            if (!user) {
                throw ApiError_1.default.badRequest(`Пользователя с почтовым адресом ${email} не существует`);
            }
            // сравниваем введенный пароль с захэшированным в базе данных
            const isPassEquals = yield bcrypt_1.default.compare(password, user.password);
            if (!isPassEquals) {
                throw ApiError_1.default.badRequest(`Пароль неверный`);
            }
            const userDto = new user_dto_1.default(user); // email, id, ?role
            const tokens = yield token_service_1.default.generateTokens(Object.assign({}, userDto));
            yield token_service_1.default.saveToken(userDto.id, tokens.refreshToken);
            return Object.assign(Object.assign({}, tokens), { user: userDto });
        });
    }
    static logout(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            // удаляем refreshToken из бд
            const token = yield token_service_1.default.removeToken(refreshToken);
            return token;
        });
    }
    static refresh(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            // если токена нет в куках, пользователь не авторизован
            if (!refreshToken) {
                throw ApiError_1.default.unAuthorizedError();
            }
            // валидируем токен (не подделан и годен)
            const userData = yield token_service_1.default.validateRefreshToken(refreshToken);
            // ищем токен в бд
            const tokenFromDb = yield token_service_1.default.findToken(refreshToken);
            if (!userData || !tokenFromDb) {
                throw ApiError_1.default.unAuthorizedError();
            }
            // получаем пользователя из бд (вдруг за это время
            // ин-ция про него изменилась и нужно зашить в токен новую
            const user = yield models_1.User.findOne({ where: { id: userData.id } });
            const userDto = new user_dto_1.default(user); // email, id, role
            // генерируем свежую пару токенов для пользователя
            const tokens = yield token_service_1.default.generateTokens(Object.assign({}, userDto));
            // сохраняем refreshToken пользователя в бд
            yield token_service_1.default.saveToken(userDto.id, tokens.refreshToken);
            return Object.assign(Object.assign({}, tokens), { user: userDto });
        });
    }
    static getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield models_1.User.findAll();
            return users;
        });
    }
    static getOneUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield models_1.User.findOne({ where: { id } });
            return users;
        });
    }
    static deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield models_1.User.destroy({
                where: { id },
            });
            return users;
        });
    }
}
exports.default = UserService;
//# sourceMappingURL=user-service.js.map
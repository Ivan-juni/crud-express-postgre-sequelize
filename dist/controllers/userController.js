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
const user_service_1 = __importDefault(require("../service/user-service"));
const express_validator_1 = require("express-validator");
const ApiError_1 = __importDefault(require("../error/ApiError"));
class UserController {
    static registration(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return next(ApiError_1.default.badRequest('Ошибка при валидации'));
                }
                // достаем введенные пользователем данные
                const { email, password, role } = req.body;
                const userData = yield user_service_1.default.registration(email, password, role);
                // храним refreshToken в куках
                res.cookie('refreshToken', userData.refreshToken, {
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    httpOnly: true, // чтобы нельзя было получить/изменить внутри браузера
                });
                return res.json(userData);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const userData = yield user_service_1.default.login(email, password);
                res.cookie('refreshToken', userData.refreshToken, {
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                });
                return res.json(userData);
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
    }
    static logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // достаем из кукис refreshToken
                const { refreshToken } = req.cookies;
                const token = yield user_service_1.default.logout(refreshToken);
                // удаляем refreshToken из кукис
                res.clearCookie('refreshToken');
                if (token === 1) {
                    return res.json({ message: 'Logout successfully' });
                }
                else {
                    return res.json({ message: 'Sth goes wrong...' });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    static refresh(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // достаем из кукис refreshToken
                const { refreshToken } = req.cookies;
                // обновляем refreshToken
                const userData = yield user_service_1.default.refresh(refreshToken);
                res.cookie('refreshToken', userData.refreshToken, {
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                });
                return res.json(userData);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield user_service_1.default.getAllUsers();
                return res.json(users);
            }
            catch (error) {
                return next(error);
            }
        });
    }
    static getOne(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    next(ApiError_1.default.badRequest("User id wasn't typed"));
                }
                const users = yield user_service_1.default.getOneUser(+id);
                return res.json(users);
            }
            catch (error) {
                return next(error);
            }
        });
    }
    static deleteOne(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    next(ApiError_1.default.badRequest("User id wasn't typed"));
                }
                const users = yield user_service_1.default.deleteUser(+id);
                return res.json(users);
            }
            catch (error) {
                return next(error);
            }
        });
    }
}
exports.default = UserController;
//# sourceMappingURL=userController.js.map
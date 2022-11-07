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
const ApiError_1 = __importDefault(require("../error/ApiError"));
const models_1 = require("../models/models");
class PostService {
    static createPost(title, content, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const newPost = yield models_1.Post.create({
                title: title,
                content: content,
                userId,
            });
            return newPost;
        });
    }
    static getPostsByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield models_1.Post.findAll({ where: { userId } });
            return posts;
        });
    }
    static deletePosts(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                throw ApiError_1.default.badRequest(`Incorrect user id`);
            }
            const posts = yield models_1.Post.destroy({
                where: {
                    userId,
                },
            });
            return posts;
        });
    }
    static deletePost(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                throw ApiError_1.default.badRequest(`Введите id пользователя`);
            }
            if (!postId) {
                throw ApiError_1.default.badRequest(`Введите id поста`);
            }
            const posts = yield models_1.Post.destroy({
                where: {
                    id: postId,
                    userId,
                },
            });
            return posts;
        });
    }
}
exports.default = PostService;
//# sourceMappingURL=post-service.js.map
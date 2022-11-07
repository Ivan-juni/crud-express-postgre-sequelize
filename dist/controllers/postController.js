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
const post_service_1 = __importDefault(require("../service/post-service"));
class PostController {
    static addPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { title, content } = req.body;
                const { id } = req.user;
                if (!id) {
                    next(ApiError_1.default.badRequest('Incorrect user id'));
                }
                const newPost = yield post_service_1.default.createPost(title, content, id);
                res.json(newPost);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getPostsByUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.user;
                if (!id) {
                    next(ApiError_1.default.badRequest('Incorrect user id'));
                }
                const posts = yield post_service_1.default.getPostsByUser(id);
                res.json(posts);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static deletePosts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.user;
                if (!id) {
                    next(ApiError_1.default.badRequest('Incorrect user id'));
                }
                const posts = yield post_service_1.default.deletePosts(id);
                if (posts !== 0) {
                    res.json({ message: 'Posts were deleted' });
                }
                else {
                    res.json({ message: "Posts weren't deleted" });
                }
                res.json(posts);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static deletePost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.params;
                const userId = req.user.id;
                if (!userId) {
                    next(ApiError_1.default.badRequest('Incorrect user id'));
                }
                if (!postId) {
                    next(ApiError_1.default.badRequest('Incorrect post id'));
                }
                const posts = yield post_service_1.default.deletePost(+postId, userId);
                if (posts === 1) {
                    res.json({ message: 'Post was deleted' });
                }
                else {
                    res.json({ message: "Post wasn't deleted" });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = PostController;
//# sourceMappingURL=postController.js.map
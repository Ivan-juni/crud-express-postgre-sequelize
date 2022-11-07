"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = (0, express_1.default)();
const postController_1 = __importDefault(require("../controllers/postController"));
const auth_middleware_1 = __importDefault(require("../middleware/auth-middleware"));
// get all user's posts
router.get('/', auth_middleware_1.default, postController_1.default.getPostsByUser);
// add post
router.post('/', auth_middleware_1.default, postController_1.default.addPost);
// delete all user's posts
router.delete('/', auth_middleware_1.default, postController_1.default.deletePosts);
// delete one user's post
router.delete('/:postId', auth_middleware_1.default, postController_1.default.deletePost);
exports.default = router;
//# sourceMappingURL=postRouter.js.map
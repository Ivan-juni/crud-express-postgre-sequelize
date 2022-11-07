"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = (0, express_1.default)();
const userRouter_1 = __importDefault(require("./userRouter"));
const postRouter_1 = __importDefault(require("./postRouter"));
router.use('/user', userRouter_1.default);
router.use('/post', postRouter_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map
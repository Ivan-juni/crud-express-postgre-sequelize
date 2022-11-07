"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = (0, express_1.default)();
const userController_1 = __importDefault(require("../controllers/userController"));
const checkRole_middleware_1 = __importDefault(require("../middleware/checkRole-middleware"));
const express_validator_1 = require("express-validator");
router.post('/registration', (0, express_validator_1.body)('email').isEmail(), (0, express_validator_1.body)('password').isLength({ min: 4, max: 32 }), userController_1.default.registration);
router.post('/login', (0, express_validator_1.body)('email').isEmail(), (0, express_validator_1.body)('password').isLength({ min: 3, max: 32 }), userController_1.default.login);
router.post('/logout', userController_1.default.logout);
router.get('/refresh', userController_1.default.refresh);
// get all users
router.get('/', (0, checkRole_middleware_1.default)('ADMIN'), userController_1.default.getAll);
// get user by id
router.get('/:id', (0, checkRole_middleware_1.default)('ADMIN'), userController_1.default.getOne);
// delete user by id
router.delete('/:id', (0, checkRole_middleware_1.default)('ADMIN'), userController_1.default.deleteOne);
// !todo change user password
// router.put('/auth/changePassword', userController.changePassword)
exports.default = router;
//# sourceMappingURL=userRouter.js.map
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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./db"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const logger_1 = __importDefault(require("./logger"));
const express_winston_1 = __importDefault(require("express-winston"));
const ErrorHandlingMiddleware_1 = __importDefault(require("./middleware/ErrorHandlingMiddleware"));
const index_1 = __importDefault(require("./routes/index"));
dotenv_1.default.config();
const port = process.env.PORT || 5000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_winston_1.default.logger(logger_1.default));
app.use(express_1.default.urlencoded({ extended: false }));
// main router
app.use('/api', index_1.default);
// Обработка ошибок, последний middleware
app.use(ErrorHandlingMiddleware_1.default);
app.get('/', (req, res) => res.status(200).json({ message: 'Server is working' }));
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.default.authenticate();
        yield db_1.default.sync();
        app.listen(port, () => console.log(`App listening on port ${port}`));
    }
    catch (error) {
        console.log(error);
    }
});
start();
//# sourceMappingURL=index.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const winston_2 = require("winston");
const customFormat = winston_2.format.printf(({ level, message, timestamp, }) => {
    return `${timestamp} ${level}: ${message}`;
});
const logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_2.format.combine(winston_2.format.json(), winston_2.format.timestamp(), customFormat),
    defaultMeta: { service: 'user-service' },
    transports: [
        //
        // - Write all logs with importance level of `error` or less to `error.log`
        // - Write all logs with importance level of `info` or less to `combined.log`
        //
        new winston_2.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston_2.transports.File({ filename: 'logs/combined.log' }),
    ],
});
//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston_2.transports.Console({
        format: winston_2.format.simple(),
    }));
}
exports.default = logger;
//# sourceMappingURL=logger.js.map
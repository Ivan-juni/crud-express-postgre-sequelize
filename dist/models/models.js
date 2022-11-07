"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = exports.Post = exports.User = void 0;
const db_1 = __importDefault(require("../db"));
const sequelize_1 = require("sequelize");
class UserModel extends sequelize_1.Model {
}
class PostModel extends sequelize_1.Model {
}
class TokenModel extends sequelize_1.Model {
}
exports.User = UserModel.init({
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: sequelize_1.DataTypes.STRING, unique: true, allowNull: false },
    password: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    role: { type: sequelize_1.DataTypes.STRING, defaultValue: 'USER' },
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE,
}, {
    tableName: 'users',
    sequelize: db_1.default,
});
exports.Post = PostModel.init({
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    content: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE,
}, {
    tableName: 'posts',
    sequelize: db_1.default,
});
exports.Token = TokenModel.init({
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    refreshToken: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    // userId: { type: DataTypes.INTEGER }, // sequelize добавит автоматически
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE,
}, {
    tableName: 'tokens',
    sequelize: db_1.default,
});
UserModel.hasMany(PostModel, {
    foreignKey: 'userId',
    sourceKey: 'id',
});
PostModel.belongsTo(UserModel, {
    foreignKey: 'userId',
    targetKey: 'id',
});
UserModel.hasOne(TokenModel, {
    foreignKey: 'userId',
    sourceKey: 'id',
});
TokenModel.belongsTo(UserModel, {
    foreignKey: 'userId',
    targetKey: 'id',
});
//# sourceMappingURL=models.js.map
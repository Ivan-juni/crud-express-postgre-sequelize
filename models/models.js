const sequelizeConnection = require('../db')
const { DataTypes } = require('sequelize')

const User = sequelizeConnection.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: 'USER' },
})

const Post = sequelizeConnection.define('post', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.STRING, allowNull: false },
  //   user_id: { type: DataTypes.INTEGER }, // sequelize добавит автоматически
})

const Token = sequelizeConnection.define('token', {
  refreshToken: { type: DataTypes.STRING, allowNull: false },
})

User.hasMany(Post)
Post.belongsTo(User)

User.hasOne(Token)
Token.belongsTo(User)

module.exports = {
  User,
  Post,
  Token,
}

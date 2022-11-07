import sequelizeConnection from '../db'
import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from 'sequelize'

class UserModel extends Model<
  InferAttributes<UserModel>,
  InferCreationAttributes<UserModel>
> {
  declare id: CreationOptional<number>
  declare email: string
  declare password: string
  declare role: string

  // timestamps!
  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>
}

class PostModel extends Model<
  InferAttributes<PostModel>,
  InferCreationAttributes<PostModel>
> {
  // id can be undefined during creation when using `autoIncrement`
  declare id: CreationOptional<number>
  declare title: string
  declare content: string

  // foreign key
  declare userId: ForeignKey<UserModel['id']>

  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>
}

class TokenModel extends Model<
  InferAttributes<TokenModel>,
  InferCreationAttributes<TokenModel>
> {
  // id can be undefined during creation when using `autoIncrement`
  declare id: CreationOptional<number>
  declare refreshToken: string

  // foreign key
  declare userId: ForeignKey<UserModel['id']>

  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>
}

export const User = UserModel.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: 'USER' },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: 'users',
    sequelize: sequelizeConnection,
  }
)

export const Post = PostModel.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.STRING, allowNull: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: 'posts',
    sequelize: sequelizeConnection,
  }
)

export const Token = TokenModel.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    refreshToken: { type: DataTypes.STRING, allowNull: false },
    // userId: { type: DataTypes.INTEGER }, // sequelize добавит автоматически
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: 'tokens',
    sequelize: sequelizeConnection,
  }
)

UserModel.hasMany(PostModel, {
  foreignKey: 'userId', // UserModelId -> userId
  sourceKey: 'id',
})
PostModel.belongsTo(UserModel, {
  foreignKey: 'userId', // UserModelId -> userId
  targetKey: 'id',
})

UserModel.hasOne(TokenModel, {
  foreignKey: 'userId', // UserModelId -> userId
  sourceKey: 'id',
})
TokenModel.belongsTo(UserModel, {
  foreignKey: 'userId', // UserModelId -> userId
  targetKey: 'id',
})

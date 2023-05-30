const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  return users.init(sequelize, DataTypes);
};
const bcrypt = require("bcrypt");

/**
 * @openapi
 * components:
 *   schemas:
 *     register:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           example: ricardoSalazar
 *         email:
 *           type: string
 *           example: axel.111yo@gmail.com
 *         password:
 *           type: string
 *           example: 1234
 *     login:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           example: axel.111yo@gmail.com
 *         password:
 *           type: string
 *           example: 1234
 *     loginresponse:
 *       type: object
 *       properties:
 *         id:
 *           type: int
 *           example: 1
 *         username:
 *           type: string
 *           example: ricardoSalazar
 *         email:
 *           type: string
 *           example: axel.111yo@gmail.com
 *         token:
 *           type: string
 *           example: $2b$10$WQYwFuxT2QrXG.isGEe38ObrzS9dNHRm1ClOQB8RHvvBnqQv1Gp3a
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

class users extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          autoIncrement: true,
          autoIncrementIdentity: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        first_name: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
        last_name: {
          type: DataTypes.STRING(30),
          allowNull: true,
        },
        email: {
          type: DataTypes.STRING(30),
          allowNull: false,
          unique: "users_email_key",
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        phone: {
          type: DataTypes.STRING(10),
          allowNull: true,
          unique: "users_phone_key",
        },
        user_type: {
          type: DataTypes.ENUM("cliente", "vendedor"),
          allowNull: true,
        },
      },
      {
        hooks: {
          beforeCreate: (user, options) => {
            const { password } = user;
            const hash = bcrypt.hashSync(password, 10);
            user.password = hash;
          },
        },
        sequelize,
        tableName: "users",
        schema: "public",
        timestamps: false,
        indexes: [
          {
            name: "users_email_key",
            unique: true,
            fields: [{ name: "email" }],
          },
          {
            name: "users_phone_key",
            unique: true,
            fields: [{ name: "phone" }],
          },
          {
            name: "users_pkey",
            unique: true,
            fields: [{ name: "id" }],
          },
        ],
      }
    );
  }
}

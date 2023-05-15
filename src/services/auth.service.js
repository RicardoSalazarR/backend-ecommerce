const { users } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

class AuthServices {
  static async register(user) {
    try {
      const {
        name: first_name,
        lastName: last_name,
        email,
        password,
        phone,
      } = user;
      const userData = {first_name,last_name,email,password,phone}
      const result = await users.create(userData);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async login(credentials) {
    try {
      const { email, password } = credentials;
      const user = await users.findOne({ where: { email } });
      if (user) {
        const isValid = bcrypt.compareSync(password, user.password);
        return isValid ? { isValid, user } : { isValid, error: "password" };
      }
      return { isValid: false, error: "email" };
    } catch (error) {
      throw error;
    }
  }
  static genToken(data) {
    try {
      const token = jwt.sign(data, process.env.JWT_SECRET, {
        algorithm: "HS512",
      });
      return token;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AuthServices;

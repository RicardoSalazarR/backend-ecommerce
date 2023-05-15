const { categories } = require("../models");

class categorieServices {
  static async getAll() {
    try {
      const result = await categories.findAll();
      return result;
    } catch (error) {
      throw error;
    }
  }

}
module.exports = categorieServices;

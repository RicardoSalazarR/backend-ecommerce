const categorieServices = require("../services/categories.service");

const getCategories = async (req, res, next) => {
  try {
    const categories = await categorieServices.getAll();
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

module.exports = {
    getCategories,
};

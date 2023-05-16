const { products, categories, images } = require("../models");
const { Op } = require("@sequelize/core");

class productService {
  static async get() {
    try {
      const result = await products.findAll({
        where: {
          available_qty: {
            [Op.gt]: 0,
          },
        },
        include: [
          {
            model: categories,
            as: "category",
            attributes: ["name"],
          },
          {
            model: images,
            as: "images",
          },
        ],
      });
      return result;
    } catch (error) {
      throw error;
    }
  }
  static async getOne(id) {
    try {
      const result = await products.findOne({
        where: { id },
        include: [
          {
            model: categories,
            as: "category",
            attributes: ["name"],
          },
          {
            model: images,
            as: "images",
          },
        ],
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getByCat(id) {
    try {
      const result = await products.findAll({
        where: { category_id: id },
        include: [
          {
            model: categories,
            as: "category",
            attributes: ["name"],
          },
          {
            model: images,
            as: "images",
          },
        ],
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async create(product) {
    try {
      const result = await products.create(product);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static updateQty(productsArray) {
    productsArray.forEach(async (product) => {
      const { id, available_qty } = await products.findByPk(product.product_id);
      const newQty = available_qty - product.quantity;
      let status = true;
      if (newQty <= 0) {
        status = false;
      }
      await products.update(
        { available_qty: newQty, status: status },
        { where: { id: id } }
      );
    });
    return true;
  }

  static async filter(filter) {
    try {
      const result = await products.findAll({
        where: {
          [Op.or]: [
            {
              title: {
                [Op.like]: `%${filter}%`,
              },
            },
            {
              description: {
                [Op.like]: `%${filter}%`,
              },
            },
            {
              brand: {
                [Op.like]: `%${filter}%`,
              },
            },
          ],
        },include: [
          {
            model: categories,
            as: "category",
            attributes: ["name"],
          },
          {
            model: images,
            as: "images",
          },
        ],
      });
      return result;

    } catch (error) {
      throw error;
    }
  }
}

module.exports = productService;

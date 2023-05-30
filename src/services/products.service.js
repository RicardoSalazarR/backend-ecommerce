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
      // product.id = 17
      const result = await products.create(product);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async addImage(productId, image) {
    try {
      const data = { product_id: productId, url: image };
      const allImages = await images.findAll()
      data.id=allImages.length+1
      const result = await images.create(data);
      return result;
    } catch (error) {
      // console.log(error);
      return false;
    }
  }

  static async destroyProduct(productId) {
    try {
      const result = await images.destroy({ where: { product_id: productId } });
      await products.destroy({ where: { id: productId } });
      if (result) {
        console.log("hola");
      }
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

  static async updProduct(productId, data) {
    try {
      const result = await products.update(data, { where: { id: productId } });
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async deleteProduct(id){
    try {
      await images.destroy({where:{product_id:id}})
      const result = await products.destroy({where:{id}})
      return result
    } catch (error) {
      throw error
    }
  }

}

module.exports = productService;

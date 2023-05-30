const {
  cart,
  products_in_cart: productsInCart,
  products,
} = require("../models");

class cartService {
  static async getCart(id) {
    try {
      const result = await cart.findOne({
        where: { user_id: id },
        include: {
          model: productsInCart,
          as: "products_in_cart",
          attributes: ["product_id", "quantity", "price"],
          include:{
            model:products,
            as:'product'
          },
        },
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async deleteProduct(id, cartId, totalPrice, price) {
    try {
      let result;
      const deleted = await productsInCart.destroy({
        where: { cart_id: cartId, product_id: id },
      });
      if (deleted) {
        result = this.changeTotal(price, totalPrice, cartId);
      }
      return result;
    } catch (error) {
      throw error;
    }
  }
  static async changeTotal(price, total, cartId) {
    try {
      const totalPrice = total - price;
      const result = await cart.update({ totalPrice }, { where: { id: cartId } });
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async updateTotal(totalPrice, cartId) {
    try {
      const result = await cart.update({ totalPrice }, { where: { id: cartId } });
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getProducts(cartId){
    try {
      const products = await productsInCart.findAll({where:{cart_id:cartId}})
      return products
    } catch (error) {
      throw error
    }
  }

  static async changeQty(productId, cartId, quantity) {
    try {
      const { id } = await productsInCart.findOne({
        where: { cart_id: cartId, product_id: productId },
      });
      const result = await productsInCart.update(
        { quantity },
        { where: { id } }
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async createCart(userId) {
    try {
      const result = await cart.create({ user_id: userId, totalPrice: 0 });
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getDataCart(userId) {
    try {
      const result = await cart.findOne({ where: { user_id: userId } });
      return result.dataValues;
    } catch (error) {
      throw error;
    }
  }

  static async addProduct(cartId, productId, quantity, totalPrice) {
    const product = await products.findOne({
      where: { id: productId },
    });
    const data = {
      cart_id: cartId,
      product_id: productId,
      quantity,
      price: product.dataValues.price,
    };
    if (product.dataValues.available_qty >= data.quantity) {
      const added = await productsInCart.create(data);
      if (added) {
        totalPrice += data.quantity * data.price;
        const update = await cart.update(
          { totalPrice: totalPrice },
          { where: { id: cartId } }
        );
        return update;
      }
    } else {
      return { error: "not enough stock" };
    }
  }

  static async emptyCart(cartId) {
    try {
      const result = await productsInCart.destroy({
        where: { cart_id: cartId },
      });
      await cart.update(
        { totalPrice: 0 },
        {
          where: { id: cartId },
        }
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = cartService;

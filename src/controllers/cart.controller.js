const cartService = require("../services/cart.service");
const productService = require("../services/products.service");

const postProduct = async (req, res, next) => {
  try {
    const { userId } = req;
    const { productId, quantity } = req.body;
    const { id: cartId, totalPrice } = await cartService.getDataCart(userId);

    if (cartId) {
      const result = await cartService.addProduct(
        cartId,
        productId,
        quantity,
        totalPrice
      );
      if (result) {
        if (result.error === "not enough stock") {
          next({ message: "not enough stock" });
        }
        res.status(201).json({ message: "Product added" });
      } else {
        next({ message: "something went wrong" });
      }
    }
  } catch (error) {
    next(error);
  }
};

const getCart = async (req, res, next) => {
  try {
    const { userId: id } = req;
    const result = await cartService.getCart(id);
    if (result) {
      res.status(200).json(result);
    } else {
      next({ message: "something went wrong" });
    }
    res.json(id);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { userId } = req;
    const { id: productId } = req.params;
    const { id: cartId, totalPrice } = await cartService.getDataCart(userId);
    const { price } = await productService.getOne(productId);

    const result = await cartService.deleteProduct(
      productId,
      cartId,
      totalPrice,
      price
    );
    console.log(price);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const updateQty = async (req, res, next) => {
  try {
    const { userId } = req;
    const { id: productId } = req.params;
    const { quantity } = req.body;
    const { id: cartId } = await cartService.getDataCart(userId);

    const result = cartService.changeQty(productId, cartId, quantity);

    if (result) {
      let newTotal = 0;
      const products = await cartService.getProducts(cartId);
      for (const product of products) {
        newTotal += product.price * product.quantity;
      }
      console.log(newTotal);
      const updated = await cartService.updateTotal(newTotal, cartId);
      if (updated) {
        res.status(200).json('Quantity updated successfull')
      }
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  postProduct,
  getCart,
  deleteProduct,
  updateQty,
};

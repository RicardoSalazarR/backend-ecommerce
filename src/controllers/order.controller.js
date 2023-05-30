const products_in_order = require("../models/products_in_order");
const cartService = require("../services/cart.service");
const orderService = require("../services/order.service");
const productsService = require("../services/products.service");
const transporter = require("../utils/mailer");

const postOrder = async (req, res, next) => {
  try {
    const { userId } = req;
    const {
      products_in_cart: productsInCart,
      id: cartId,
      totalPrice,
    } = await cartService.getCart(userId);
    const products = [];

    const fechaActual = new Date();
    const ano = fechaActual.getFullYear();
    const mes = fechaActual.getMonth() + 1;
    const dia = fechaActual.getDate();

    const fecha_creacion = `${ano}-${mes.toString().padStart(2, "0")}-${dia
      .toString()
      .padStart(2, "0")}`;


    const dataCart = { user_id: userId, totalPrice,dateOf:fecha_creacion };
    if (productsInCart.length > 0) {
      const order = await orderService.createOrder(dataCart);
      productsInCart.forEach((product) => {
        product.dataValues.order_id = order.dataValues.id;
        products.push(product.dataValues);
      });
      const allGood = orderService.addProductInOrder(products);
      if (allGood) {
        await cartService.emptyCart(cartId);
        res.status(200).json({ message: "Order created" });
      } else {
        next({ message: "something went wrong" });
      }
    } else {
      next({ message: "There aren´t products in the cart" });
    }
  } catch (error) {
    next(error);
  }
};
// res.json({productsInCart,cartId,totalPrice})

const getOrders = async (req, res, next) => {
  try {
    const { userId } = req;
    const orders = await orderService.getOrders(userId);
    if (orders) {
      res.status(200).json(orders);
    } else {
      next({ message: "something went wrong" });
    }
  } catch (error) {
    next(error);
  }
};

const purchaseOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const { userId } = req;
    const { status } = await orderService.isValid(orderId, userId);
    if (status === "ok") {
      const products = await orderService.purchase(orderId);
      if (products) {
        await productsService.updateQty(products);
        await transporter.sendMail({
          from: "axel.111yo@gmail.com",
          to: req.userEmail,
          subject: "Purchased",
          html: "<h1>Order purchased</h1> <p>Your order was successfully purchased</p>",
        });
        res
          .status(200)
          .json({ message: "Your order was successfully purchased" });
      } else {
        next({ message: "something went wrong" });
      }
    } else {
      next({ message: status });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  postOrder,
  getOrders,
  purchaseOrder,
};

const DataTypes = require("sequelize").DataTypes;
const _cart = require("./cart");
const _categories = require("./categories");
const _images = require("./images");
const _order = require("./order");
const _products = require("./products");
const _products_in_cart = require("./products_in_cart");
const _products_in_order = require("./products_in_order");
const _users = require("./users");

function initModels(sequelize) {
  const cart = _cart(sequelize, DataTypes);
  const categories = _categories(sequelize, DataTypes);
  const images = _images(sequelize, DataTypes);
  const order = _order(sequelize, DataTypes);
  const products = _products(sequelize, DataTypes);
  const products_in_cart = _products_in_cart(sequelize, DataTypes);
  const products_in_order = _products_in_order(sequelize, DataTypes);
  const users = _users(sequelize, DataTypes);

  products_in_cart.belongsTo(cart, { as: "cart", foreignKey: "cart_id"});
  cart.hasMany(products_in_cart, { as: "products_in_cart", foreignKey: "cart_id"});
  products.belongsTo(categories, { as: "category", foreignKey: "category_id"});
  categories.hasMany(products, { as: "products", foreignKey: "category_id"});
  products_in_order.belongsTo(order, { as: "order", foreignKey: "order_id"});
  order.hasMany(products_in_order, { as: "products_in_order", foreignKey: "order_id"});
  images.belongsTo(products, { as: "product", foreignKey: "product_id"});
  products.hasMany(images, { as: "images", foreignKey: "product_id"});
  products_in_cart.belongsTo(products, { as: "product", foreignKey: "product_id"});
  products.hasMany(products_in_cart, { as: "products_in_cart", foreignKey: "product_id"});
  products_in_order.belongsTo(products, { as: "product", foreignKey: "product_id"});
  products.hasMany(products_in_order, { as: "products_in_order", foreignKey: "product_id"});
  cart.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(cart, { as: "carts", foreignKey: "user_id"});
  order.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(order, { as: "orders", foreignKey: "user_id"});

  return {
    cart,
    categories,
    images,
    order,
    products,
    products_in_cart,
    products_in_order,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;

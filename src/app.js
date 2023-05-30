const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const routerApi = require("./routers");
const error = require("./middlewares/error.middleware");
const db = require("./utils/database");
const initModels = require("./models/init-models");

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

// db.authenticate()
//   .then(() => console.log("autenticacion exitosa"))
//   .catch((error) => console.log(error));

// db.sync({ force: false }) //force true para sobreescribir
//   .then(() => console.log("Base de datos sincronizada"))
//   .catch((error) => console.log(error));

routerApi(app);

app.use(error);

module.exports = app;

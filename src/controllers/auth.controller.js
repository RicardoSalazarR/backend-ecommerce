const AuthServices = require("../services/auth.service");
const cartService = require("../services/cart.service");
const transporter = require("../utils/mailer");

const register = async (req, res, next) => {
  try {
    const user = req.body;
    let valid = true;
    const { name, lastName, email, password, phone } = req.body;
    const data = { name, lastName, email, password, phone };

    for (const el in data) {
      if (!data[el]) {
        valid = false;
      }
    }
    if (valid) {
      const result = await AuthServices.register(data);

      if (result) {
        const { id } = result;
        await cartService.createCart(id);
        res.status(201).json({ message: "user created" });
        await transporter.sendMail({
          from: "axel.111yo@gmail.com",
          to: result.email,
          subject: "Email confirmation",
          html: "<h1>Bienvenido a la app</h1> <p>Tienes que confirmar el email</p> <p>Solo haz clic en el siguiente <a href='#'' target='new_blank'> enlace </a></p>",
        });
      } else {
        next({ message: "something went wrong" });
      }
    } else {
      next({ message: "There is a value missed" });
    }
  } catch (error) {
    next(error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({
        error: "Missing data",
        message: "Not email prooviided",
      });
    }
    if (!password) {
      return res.status(400).json({
        error: "Missing data",
        message: "Not password prooviided",
      });
    }
    const result = await AuthServices.login({ email, password });
    if (result.isValid) {
      const { first_name, last_name, id, email } = result.user;
      const userName = `${first_name} ${last_name}`;
      const userData = { id, userName, email };
      const token = AuthServices.genToken(userData);
      userData.token = token;
      res.json(userData);
    } else if (result.error === "password") {
      res.status(400).json({ message: "invalid password" });
    } else {
      res.status(400).json("user not found");
    }
  } catch (error) {
    res.status(400).json({ message: "something went wrong" });
  }
};

module.exports = {
  register,
  login,
};

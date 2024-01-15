const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const jsonwebtoken = require("../libs/jsonwebtoken");

const AccountController = require("../controllers/AccountController");
const CardController = require("../controllers/CardController");

//Register
const register = async (req, res) => {
  const { name, lastName, email, password } = req.body;

  try {
    // Verificar si el usuario ya existe
    const userVerify = await User.findOne({ email });
    if (userVerify) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    // Generar automáticamente el número de cuenta
    const account = await AccountController.createAccount();

    // Generar automáticamente la tarjeta
    const card = await CardController.createCard(account._id);

    // Crear el usuario
    const user = await User.create({
      name,
      lastName,
      email,
      password,
      user_account: account._id,
      user_card: card._id,
    });

    // Guardar el usuario
    await user.save();
    // Devolver una respuesta más descriptiva
    return res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    // Devolver un mensaje más descriptivo en caso de error
    console.error("Error al registrar al usuario:", error);
    return res
      .status(500)
      .json({ error: "Hubo un error al registrar al usuario" });
  }
};

//login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email/Password required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ auth: false, error: "Invalid Email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ auth: false, error: "Invalid Password" });
    }

    const accessToken = jsonwebtoken.GenerateAccessToken(user);

    return res.header("auth-token", accessToken).json({
      auth: true,
      user: user._id,
      accessToken: accessToken,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//logout

module.exports = {
  register,
  login,
};

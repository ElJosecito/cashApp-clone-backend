const { populate } = require("../models/AccountModel");
const User = require("../models/UserModel");

const CardController = require("./CardController");

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userWithAccount = await User.findById(
      id,
      "name lastName email contacts user_account user_card"
    )
      .populate({
        path: "user_account",
        select: "accountNumber balance transactions",
        populate: {
          path: "transactions",
          select: "amount type transactionDate"
        },
      })
      .populate({
        path: "user_card",
        select: "cardNumber card_account expirationDate cvv",
        populate: {
          path: "card_account",
          select: "accountNumber balance transactions",
        },
      })
      .populate({ path: "contacts", select: "name lastName email" });

    if (!userWithAccount) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    return res.status(200).json(userWithAccount);
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    return res
      .status(500)
      .json({ error: "Hubo un error al obtener el usuario" });
  }
};

// add contacts to user

const addContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { contactId } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    if (user.contacts.includes(contactId)) {
      return res.status(400).json({ error: "El usuario ya es contacto" });
    }

    user.contacts.push(contactId);

    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error al agregar contacto:", error);
    return res.status(500).json({ error: "Hubo un error al agregar contacto" });
  }
};

//Delete contacts to user

const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { contactId } = req.body;

    const user = await User.findById(id, "contacts");

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    if (!user.contacts.includes(contactId)) {
      return res.status(400).json({ error: "El usuario no es contacto" });
    }

    user.contacts.pull(contactId);

    await user.save();
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error al eliminar contacto:", error);
    return res
      .status(500)
      .json({ error: "Hubo un error al eliminar contacto" });
  }
};

//add card to user

const addCard = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    if (user.Card) {
      return res.status(400).json({ error: "El usuario ya tiene una tarjeta" });
    }

    const card = await CardController.createCard(req, res, user.accountNumber);

    user.Card = card;

    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error al agregar tarjeta:", error);
    return res.status(500).json({ error: "Hubo un error al agregar tarjeta" });
  }
};

//get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(
      {},
      "name lastName email accountNumber contacts"
    );

    if (!users) {
      return res.status(404).json({ error: "No hay usuarios" });
    }

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return res.status(500).json({ error: "Hubo un error al obtener usuarios" });
  }
};

// export controllers
module.exports = {
  getUser,
  addContact,
  deleteContact,
  addCard,
  getAllUsers,
};

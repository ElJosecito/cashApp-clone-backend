const Card = require("../models/CardModel");
const Account = require("../models/AccountModel");

const createCard = async (accId) => {

  try {
    const account = await Account.findOne({ _id: accId });

    if (!account) {
      // Puedes manejar el error directamente aquí o simplemente devolver null
      throw new Error("Cuenta no encontrada");
    }

    const generateCardNumber = () => {
      return Math.floor(1000000000000000 + Math.random() * 9000000000000000);
    };

    let cardNumber;
    let existingCard;

    do {
      cardNumber = generateCardNumber();
      existingCard = await Card.findOne({ cardNumber: cardNumber });
    } while (existingCard);

    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 4);
    const formattedDate = `${
      expirationDate.getMonth() + 1
    }/${expirationDate.getFullYear()}`;

    const cvv = Math.floor(100 + Math.random() * 900);

    const card = await Card.create({
      cardNumber: cardNumber,
      card_account: accId,
      expirationDate: formattedDate,
      cvv: cvv,
    });

    await card.save();
    return card;  // Devuelve el objeto completo de la tarjeta
  } catch (error) {
    console.error("Error al crear la tarjeta:", error);
    return json({ error: "Hubo un error al crear la tarjeta" });
  }
};

//pay with card

const payWithCard = async (req, res) => {

  try {
    const { cardNumber, expirationDate, cvv, amount } = req.body;

    if (!cardNumber || !expirationDate || !cvv || !amount) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    const card = await Card.findOne({ cardNumber: cardNumber });

    if (!card) {
      return res.status(404).json({ error: "Tarjeta no encontrada" });
    }

    if (card.expirationDate !== expirationDate) {
      return res.status(400).json({ error: "Fecha de expiración incorrecta" });
    }

    if (card.cvv !== cvv) {
      return res.status(400).json({ error: "CVV incorrecto" });
    }

    const account = await Account.findOne({ _id: card.card_account });

    if (!account) {
      return res.status(404).json({ error: "Cuenta no encontrada" });
    }

    if (account.balance < amount) {
      return res.status(400).json({ error: "Saldo insuficiente" });
    }

    account.balance -= amount;

    await account.save();

    return res.status(200).json({ message: "Pago realizado exitosamente" });

  } catch (error) {
    console.error("Error al pagar con la tarjeta:", error);
    return res.status(500).json({ error: "Hubo un error al pagar con la tarjeta" });
  }
};

//export modules
module.exports = {
  createCard,
  payWithCard,
};

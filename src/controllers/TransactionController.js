const Transaction = require("../models/TransactionModel");
const Account = require("../models/AccountModel");

// get transaction by id
const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ error: "Transacción no encontrada" });
    }
    return res.status(200).json(transaction);
  } catch (error) {
    console.error("Error al obtener la transacción:", error);
    return res
      .status(500)
      .json({ error: "Hubo un error al obtener la transacción" });
  }
};

// create transaction

const createTransaction = async (accountNumber, amount, type) => {
  try {
    const transaction = await Transaction.create({
      accountNumber,
      amount,
      type,
    });
    // Guarda la transacción
    await transaction.save();

    // Agrega la transacción a la lista de transacciones de la cuenta
    const account = await Account.findById(accountNumber);
    account.transactions.push(transaction._id);
    await account.save();

    return transaction;
  } catch (error) {
    console.error("Error al crear la transacción:", error);
    return json({ error: "Hubo un error al crear la transacción" });
  }
};

// module exports
module.exports = {
  getTransactionById,
  createTransaction,
};

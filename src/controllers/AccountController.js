const Account = require("../models/AccountModel");
const User = require("../models/UserModel");
const TransactionController = require("./TransactionController");


//create account
const createAccount = async () => {
  try {
    let existingAccount;
    let accNum;

    do {
      accNum = Math.floor(1000000000 + Math.random() * 9000000000);
      existingAccount = await Account.findOne({ accountNumber: accNum });
    } while (existingAccount);

    // Verificar si accNum es null y manejarlo adecuadamente
    if (!accNum) {
      console.error("Error: El número de cuenta generado es nulo.");
      throw new Error("Error al generar el número de cuenta.");
    }

    const account = await Account.create({
      accountNumber: accNum,
      balance: 0,
    });

    return account;
  } catch (error) {
    console.error("Error al crear la cuenta:", error);
    throw error; // Propagar el error para que pueda ser manejado en el nivel superior
  }
};


//add money to account
const addMoney = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    const user = await User.findById(id);

    const account = await Account.findById(user.user_account);

    if (!account) {
      return res.status(404).json({ error: "Cuenta no encontrada" });
    }

    account.balance += amount;

    await account.save();

    const transaction = await TransactionController.createTransaction(
      account._id,
      amount,
      "deposit"
    );

    return res.status(200).json(account);
  } catch (error) {
    console.error("Error al agregar dinero:", error);
    return res.status(500).json({ error: "Hubo un error al agregar dinero" });
  }
};

//withdraw money from account
const withdrawMoney = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    const user = await Account.findById(id);

    const account = await Account.findById(user.accountNumber);

    if (!account) {
      return res.status(404).json({ error: "Cuenta no encontrada" });
    }

    if (account.balance < amount) {
      return res.status(400).json({ error: "Saldo insuficiente" });
    }

    account.balance -= amount;

    const transaction = await TransactionController.createTransaction(
      account._id,
      amount,
      "withdraw"
    );

    await account.save();
    return res.status(200).json(account);
  } catch (error) {
    console.error("Error al retirar dinero:", error);
    return res.status(500).json({ error: "Hubo un error al retirar dinero" });
  }
};

//transfer money from account to account

const transferMoney = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, accountNumber } = req.body;

    const user = await User.findById(id);
    
    console.log("user account:" + user)
    const account = await Account.findById(user.user_account);

    if (!account) {
      return res.status(404).json({ error: "Cuenta no encontrada" });
    }

    if (account.balance < amount) {
      return res.status(400).json({ error: "Saldo insuficiente" });
    }

    const accountToTransfer = await Account.findOne({
      accountNumber: accountNumber,
    });

    if (!accountToTransfer) {
      return res.status(404).json({ error: "Cuenta no encontrada" });
    }

    account.balance -= amount;
    accountToTransfer.balance += amount;

    await account.save();
    await accountToTransfer.save();

    const transaction = await TransactionController.createTransaction(
      account._id,
      amount,
      "transfer"
    );

    return res.status(200).json(account);
  } catch (error) {
    console.error("Error al transferir dinero:", error);
    return res
      .status(500)
      .json({ error: "Hubo un error al transferir dinero" });
  }
}

module.exports = {
  createAccount,
  addMoney,
  withdrawMoney,
  transferMoney,
};

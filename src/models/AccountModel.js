const mongoose = require("mongoose");

const AccountModel = new mongoose.Schema(
  {
    accountNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      required: true,
    },
    transactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
      },
    ],
    creationDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Account", AccountModel);

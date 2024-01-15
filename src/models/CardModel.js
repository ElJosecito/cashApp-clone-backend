const mongoose = require("mongoose");
const { Schema } = mongoose;

const cardSchema = new Schema({
  cardNumber: {
    type: Number,
    required: true,
  },
  card_account: {  
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  expirationDate: {
    type: String,
    required: true,
  },
  cvv: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Card", cardSchema);
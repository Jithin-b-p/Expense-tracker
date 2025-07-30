import mongoose from "mongoose";

const transactionSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  paymentType: {
    type: String,
    enum: ["cash", "card"],
    required: true,
  },

  category: {
    type: String,
    enum: ["investment", "saving", "expense"],
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  location: {
    type: String,
    default: "Unknown",
  },

  date: {
    type: Date,
    required: true,
  },
});

const Transacation = mongoose.model("Transaction", transactionSchema);

export default Transacation;

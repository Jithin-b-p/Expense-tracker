import Transacation from "../models/transaction.model";

const transactionResolver = {
  Query: {
    transaction: async (_, __, context) => {
      try {
        if (!context.getUser()) throw new Error("Unauthorized User");

        const userId = await context.getUser()._id;
        const transactions = await Transacation.find({ userId });

        return transactions;
      } catch (err) {
        console.error("Error getting transactions: ", err);
        throw new Error("Error getting transactions");
      }
    },

    transaction: async (_, { transactionId }) => {
      try {
        const transaction = await Transacation.findById(transactionId);
        return transaction;
      } catch (err) {
        console.error("Error getting transaction: ", err);
        throw new Error("Error getting transaction");
      }
    },
  },
  Mutation: {
    createTransaction: async (_, { input }, context) => {
      try {
        const newTransaction = new Transaction({
          ...input,
          userId: context.getUser()._id,
        });

        await newTransaction.save();
        return newTransaction;
      } catch (err) {
        console.error("Error creating transaction: ", err);
        throw new Error("Error creating transaction");
      }
    },
    updateTransaction: async (_, { input }) => {
      try {
        const updatedTransaction = await Transacation.findByIdAndUpdate(
          input.userId,
          input,
          { new: true }
        );
        return updatedTransaction;
      } catch (err) {
        console.error("Error updating transaction: ", err);
        throw new Error("Error updating transaction");
      }
    },
    deleteTransaction: async (_, { transactionId }) => {
      try {
        const deletedTransaction = await Transacation.findByIdAndDelete(
          transactionId
        );
        return deletedTransaction;
      } catch (err) {
        console.error("Error deleting transaction: ", err);
        throw new Error("Error deleting transaction");
      }
    },
  },
};

export default transactionResolver;

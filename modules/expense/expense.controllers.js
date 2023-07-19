const { ObjectId } = require("mongodb");
const { expenseCollection } = require("../../index.js");





const createExpense = async (req, res) => {
  const expense = req.body;

  console.log(expense)

  await expenseCollection.insertOne(expense);
  // console.log(result);
  // Send a response back to the client
  res.json({ message: "Data received successfully" });
};
const getAllExpense = async (req, res) => {

  const expenses = await expenseCollection.find({}).toArray();
  // console.log(result);
  // Send a response back to the client
 res.status(200).json({ expenses });
};


module.exports = {
  createExpense,
  getAllExpense
};

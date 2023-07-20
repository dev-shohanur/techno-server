const { ObjectId } = require("mongodb");
const { expenseCollection } = require("../../index.js");





const createExpense = async (req, res) => {
  const expense = req.body;

  await expenseCollection.insertOne(expense);
  
  // Send a response back to the client
  res.json({ message: "Data received successfully" });
};
const getAllExpense = async (req, res) => {

  const expenses = await expenseCollection.find({}).toArray();
  
  // Send a response back to the client
 res.status(200).json({ expenses });
};
const getExpenseBySearch = async (req, res) => {

  const search = req.params.key;

  const expenses = await expenseCollection.find({
    $or: [
      { title: { $regex: ".*" + search + ".*" } },
      { amount: { $regex: ".*" + search + ".*" } },
      { date: { $regex: ".*" + search + ".*" } },
      { category: { $regex: ".*" + search + ".*" } },
      { invoiceId: { $regex: ".*" + search + ".*" } },
      { remark: { $regex: ".*" + search + ".*" } },
    ],
  }).toArray();
  // Send a response back to the client
 res.status(200).json({ expenses });
};


module.exports = {
  createExpense,
  getAllExpense,
  getExpenseBySearch
};

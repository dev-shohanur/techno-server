const express = require("express");
const {
  getAllExpense,
  createExpense,
  getExpenseBySearch,
  getExpenses
} = require("./expense.controllers");
const expenseRoutes = express.Router();

// Define the Sells routes

expenseRoutes.get("/expenses/", (req, res) => {
  console.log("2222222")
  getExpenses(req, res);
});
expenseRoutes.post("/", (req, res) => {
  createExpense(req, res);
});
expenseRoutes.get("/:key", (req, res) => {
  getExpenseBySearch(req, res);
});
expenseRoutes.get("/", (req, res) => {
  getAllExpense(req, res);
});

module.exports = expenseRoutes;

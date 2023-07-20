const express = require("express");
const {
  getAllExpense,
  createExpense,
  getExpenseBySearch
} = require("./expense.controllers");
const expenseRoutes = express.Router();

// Define the Sells routes

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

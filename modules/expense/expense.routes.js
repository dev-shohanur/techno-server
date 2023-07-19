const express = require("express");
const {
  getAllExpense,
  createExpense
} = require("./expense.controllers");
const expenseRoutes = express.Router();

// Define the Sells routes

expenseRoutes.post("/", (req, res) => {
  createExpense(req, res);
});
expenseRoutes.get("/", (req, res) => {
  getAllExpense(req, res);
});

module.exports = expenseRoutes;

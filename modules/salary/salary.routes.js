const express = require("express");
const {
  createSalary
} = require("./salary.controllers");
const salaryRoutes = express.Router();

// Define the Sells routes

salaryRoutes.post("/", (req, res) => {
  createSalary(req, res);
});

module.exports = salaryRoutes;

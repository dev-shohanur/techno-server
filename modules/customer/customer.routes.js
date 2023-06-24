const express = require("express");
const {
  createCustomer,
  getCustomerByNumber,
} = require("./customer.controllers");
const customerRoutes = express.Router();

// Define the user routes
customerRoutes.post("/", (req, res) => {
  createCustomer(req, res);
});
customerRoutes.get("/", (req, res) => {
  getCustomerByNumber(req, res);
});

module.exports = customerRoutes;

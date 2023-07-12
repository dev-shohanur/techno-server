const express = require("express");
const {
  createCustomer,
  getAllCustomer,
  getCustomerById,
  updateCustomer,
} = require("./customer.controllers");
const customerRoutes = express.Router();

// Define the user routes
customerRoutes.post("/", (req, res) => {
  createCustomer(req, res);
});
customerRoutes.get("/:key", (req, res) => {
  getAllCustomer(req, res);
});
customerRoutes.get("/:id", (req, res) => {
  getCustomerById(req, res);
});
customerRoutes.put("/:id", (req, res) => {
  updateCustomer(req, res);
});

module.exports = customerRoutes;

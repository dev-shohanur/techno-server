const express = require("express");
const {
  createCustomer,
  getAllCustomer,
  getCustomerById,
<<<<<<< HEAD
  updateCustomer,
=======
  updateCustomer
>>>>>>> Update With Customer Collection
} = require("./customer.controllers");
const customerRoutes = express.Router();

// Define the user routes
customerRoutes.post("/", (req, res) => {
  createCustomer(req, res);
});
customerRoutes.get("/", (req, res) => {
  getAllCustomer(req, res);
});
customerRoutes.get("/:id", (req, res) => {
  getCustomerById(req, res);
});
customerRoutes.put("/:id", (req, res) => {
  updateCustomer(req, res);
});

module.exports = customerRoutes;

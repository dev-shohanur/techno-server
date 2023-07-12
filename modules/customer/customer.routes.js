const express = require("express");
const {
  createCustomer,
  getAllCustomer,
  getCustomerById,
  updateCustomer,
  getAllCustomerBySearch,
} = require("./customer.controllers");
const customerRoutes = express.Router();

// Define the user routes
customerRoutes.post("/", (req, res) => {
  createCustomer(req, res);
});
customerRoutes.get("/data/:id", (req, res) => {
  getCustomerById(req, res);
});
customerRoutes.get("/:key", (req, res) => {
  getAllCustomerBySearch(req, res);
});
customerRoutes.get("/", (req, res) => {
  getAllCustomer(req, res);
});

customerRoutes.put("/:id", (req, res) => {
  updateCustomer(req, res);
});

module.exports = customerRoutes;

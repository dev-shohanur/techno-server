const express = require("express");
const {
  createProduct
} = require("./product.controllers");
const productRoutes = express.Router();

// Define the Sells routes

productRoutes.post("/", (req, res) => {
  createProduct(req, res);
});

module.exports = productRoutes;

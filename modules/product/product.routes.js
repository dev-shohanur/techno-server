const express = require("express");
const {
  createProduct, getProducts
} = require("./product.controllers");
const productRoutes = express.Router();

// Define the Sells routes

productRoutes.post("/", (req, res) => {
  createProduct(req, res);
});

productRoutes.get("/", (req, res) => {
  getProducts(req, res);
});

module.exports = productRoutes;

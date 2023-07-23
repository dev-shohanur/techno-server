const express = require("express");
const {
  createProduct, getProducts, getCategory, getProductById, updateProductById, updateProductStock
} = require("./product.controllers");
const productRoutes = express.Router();

// Define the Sells routes

productRoutes.post("/", (req, res) => {
  createProduct(req, res);
});

productRoutes.get("/", (req, res) => {
  getProducts(req, res);
});
productRoutes.get("/category", (req, res) => {
  getCategory(req, res);
});
productRoutes.put("/:id", (req, res) => {
  updateProductById(req, res);
});
productRoutes.put("/stock/:id", (req, res) => {
  updateProductStock(req, res);
});
productRoutes.get("/:id", (req, res) => {
  getProductById(req, res);
});

module.exports = productRoutes;

const express = require("express");
const { getAllProduct, addNewProduct, updateProduct, deleteProduct, updateProductShow, getProductsForUser, getAProducts } = require("./product.controllers.js");
const productRoutes = express.Router();

// Define the user routes

productRoutes.get("/", (req, res) => {
  getAllProduct(req, res);
});
productRoutes.get("/:id", (req, res) => {
  getAProducts(req, res);
});
productRoutes.get("/products", (req, res) => {
  getProductsForUser(req, res);
});
productRoutes.post("/", (req, res) => {
  addNewProduct(req, res);
});
productRoutes.put("/:id", (req, res) => {
  updateProduct(req, res);
});
productRoutes.put("/show/:id", (req, res) => {
  updateProductShow(req, res);
});
productRoutes.delete("/:id", (req, res) => {
  deleteProduct(req, res);
});

module.exports = productRoutes;

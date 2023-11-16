const express = require("express");
const {
  createProduct, getProducts, getCategory, getProductById, updateProductById, updateProductStock, getVoucherCodeById, getCategoryById, productByProductCode, decreaseProductStock, addProductStock, updateProductionId
} = require("./product.controllers");
const productRoutes = express.Router();

// Define the Sells routes

productRoutes.post("/", (req, res) => {
  createProduct(req, res);
});

productRoutes.get("/", (req, res) => {
  getProducts(req, res);
});

productRoutes.put("/stock-decrease", (req, res) => {
  decreaseProductStock(req, res);
});
productRoutes.put("/update/production/:id", (req, res) => {
  updateProductionId(req, res);
});
productRoutes.put("/stock-add", (req, res) => {
  addProductStock(req, res);
});

productRoutes.get("/:code", (req, res) => {
  productByProductCode(req, res);
});

productRoutes.get("/category/category", (req, res) => {
  getCategory(req, res);
});

productRoutes.get("/category/:id", (req, res) => {
  getCategoryById(req, res);
});
productRoutes.put("/:id", (req, res) => {
  updateProductById(req, res);
});
productRoutes.put("/stock/:id", (req, res) => {
  updateProductStock(req, res);
});

productRoutes.get("/product/:id", (req, res) => {
  getProductById(req, res);
});
productRoutes.get("/code/:code", (req, res) => {
  getVoucherCodeById(req, res);
});



module.exports = productRoutes;

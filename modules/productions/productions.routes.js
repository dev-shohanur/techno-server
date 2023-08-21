const express = require("express");
const {
  getCategory,
  createCategory
} = require("./productions.controllers");
const productionRoutes = express.Router();

// Define the Sells routes

productionRoutes.post("/category", (req, res) => {
  createCategory(req, res);
});
productionRoutes.get("/category", (req, res) => {
  getCategory(req, res);
});

module.exports = productionRoutes;

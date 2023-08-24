const express = require("express");
const {
  getCategory,
  createCategory,
  createProduction,
  getAllProduction,
  updatePaymentStatus,
  getThisWeekProduction
} = require("./productions.controllers");
const productionRoutes = express.Router();

// Define the Sells routes

productionRoutes.post("/", (req, res) => {
  createProduction(req, res);
});
productionRoutes.put("/:id", (req, res) => {
  updatePaymentStatus(req, res);
});
productionRoutes.get("/weekly-production", (req, res) => {
  getThisWeekProduction(req, res);
});
productionRoutes.post("/category", (req, res) => {
  createCategory(req, res);
});
productionRoutes.get("/category", (req, res) => {
  getCategory(req, res);
});
productionRoutes.get("/", (req, res) => {
  getAllProduction(req, res);
});

module.exports = productionRoutes;

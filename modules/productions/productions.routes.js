const express = require("express");
const {
  getCategory,
  createCategory,
  createProduction,
  getAllProduction,
  updatePaymentStatus,
  getThisWeekProduction,
  getProductionById,
  createCustomProduction,
  getCustomProductionById,
  getTaskByTailorId,
  updateCustomProductionStatus,
  getAllCustomProduction,
  updateRejectedText,
  getLastCustomProduction
} = require("./productions.controllers");
const productionRoutes = express.Router();

// Define the Sells routes

productionRoutes.post("/", (req, res) => {
  createProduction(req, res);
});
productionRoutes.post("/custom-production", (req, res) => {
  createCustomProduction(req, res);
});
productionRoutes.get("/last/production", (req, res) => {
  getLastCustomProduction(req, res);
});

productionRoutes.get("/custom-production", (req, res) => {
  getAllCustomProduction(req, res);
});
productionRoutes.get("/custom-production/:id", (req, res) => {
  getCustomProductionById(req, res);
});
productionRoutes.put("/custom-production/:id", (req, res) => {
  updateRejectedText(req, res);
});

productionRoutes.get("/tailor/:id", (req, res) => {
  getTaskByTailorId(req, res);
});
productionRoutes.put("/status/:id", (req, res) => {
  updateCustomProductionStatus(req, res);
});



productionRoutes.get("/:id", (req, res) => {
  getProductionById(req, res);
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

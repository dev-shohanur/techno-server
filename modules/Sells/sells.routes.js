const express = require("express");
const {
  getAllSells,
  createSell,
  getASell,
  updateSell,
  createPosSales,
  getAllPosSales,
  getAPosSale
} = require("./sells.controllers");
const sellsRoutes = express.Router();

// Define the Sells routes

sellsRoutes.get("/", (req, res) => {
  getAllSells(req, res);
});
sellsRoutes.get("/pos-sales", (req, res) => {
  getAllPosSales(req, res);
});
sellsRoutes.get("/pos-sales/:id", (req, res) => {
  getAPosSale(req, res);
});
sellsRoutes.post("/pos-sales", (req, res) => {
  createPosSales(req, res);
});

sellsRoutes.post("/:id", (req, res) => {
  createSell(req, res);
});
sellsRoutes.get("/:id", (req, res) => {
  getASell(req, res);
});

sellsRoutes.put("/:id", (req, res) => {
  updateSell(req, res);
});

module.exports = sellsRoutes;

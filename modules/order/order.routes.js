const express = require("express");
const {
  getAllOrder,
  updateOrder,
  createOrder,
  getAOrder,
  deleteAOrderById,
} = require("./order.controllers.js");
const orderRoutes = express.Router();

// Define the user routes
orderRoutes.get("/", (req, res) => {
  getAllOrder(req, res);
});
orderRoutes.get("/:id", (req, res) => {
  getAOrder(req, res);
});
orderRoutes.put("/:id", (req, res) => {
  updateOrder(req, res);
});
orderRoutes.delete("/:id", (req, res) => {
  deleteAOrderById(req, res);
});
orderRoutes.post("/createOrder", (req, res) => {
  createOrder(req, res);
});

module.exports = orderRoutes;

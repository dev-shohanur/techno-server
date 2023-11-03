const express = require("express");
const {
  getAllOrder,
  updateOrder,
  createOrder,
  getAOrder,
  deleteAOrderById,
  updateDeliveryStatus,
  updateProductionId,
  getAllDefaultSize,
  // testEndpoint,
  getLastOrder,
  getReadyToShipProduct
} = require("./order.controllers.js");
const orderRoutes = express.Router();

// orderRoutes.get("/test-endpoint", (req, res) => {
//   testEndpoint(req, res);
// });

orderRoutes.post("/create/new-order", (req, res) => {
  createOrder(req, res);
});

orderRoutes.get("/ready-to-ship", (req, res) => {
  getReadyToShipProduct(req, res);
});
orderRoutes.get("/last", (req, res) => {
  getLastOrder(req, res);
});
orderRoutes.get("/", (req, res) => {
  getAllOrder(req, res);
});
orderRoutes.get("/size", (req, res) => {
  getAllDefaultSize(req, res);
});

orderRoutes.put("/production/:id", (req, res) => {
  updateProductionId(req, res);
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

orderRoutes.put("/deliveryStatus/:id", (req, res) => {
  updateDeliveryStatus(req, res);
});


module.exports = orderRoutes;

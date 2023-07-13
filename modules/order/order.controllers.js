const { OrderCollection } = require("../../index.js");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

const getAllOrder = async (req, res) => {
  const cursor = OrderCollection.find({});

  const orders = await cursor.toArray();
  res.send(orders);
};

const updateOrder = (req, res) => {
  const id = req.params.id; // Extract the document ID from the request parameters
  const updateData = req.body; // Extract the updated data from the request body

  // Update the document in the collection
  OrderCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateData })
    .then(() => {
      res.sendStatus(200); // Send a success status code if the update was successful
    })
    .catch((error) => {
      console.error("Error updating document:", error);
      res.status(500).send("Error updating document");
    });
};

const createOrder = async (req, res) => {
  const receivedData = req.body;

  console.log(receivedData);

  await OrderCollection.insertOne(receivedData);
  // console.log(result);
  // Send a response back to the client
  res.json({ message: "Data received successfully" });
};

const getAOrder = (req, res) => {
  const id = req.params.id; // Extract the document ID from the request parameters

  console.log(id);
  // Find the document in the collection
  OrderCollection.findOne({ _id: new ObjectId(id) })
    .then((document) => {
      if (document) {
        res.json(document); // Send the found document as the response
      }
      // else {
      //   res.sendStatus(404); // Send a 404 status code if the document was not found
      // }
    })
    .catch((error) => {
      console.error("Error finding document:", error);
      res.status(500).send("Error finding document");
    });
};

const deleteAOrderById = (req, res) => {
  const id = req.params.id; // Extract the document ID from the request parameters

  console.log(id);
  // Find the document in the collection
  OrderCollection.deleteOne({ _id: new ObjectId(id) })
    .then((document) => {
      if (document) {
        res.json(document); // Send the found document as the response
      }
      // else {
      //   res.sendStatus(404); // Send a 404 status code if the document was not found
      // }
    })
    .catch((error) => {
      console.error("Error finding document:", error);
      res.status(500).send("Error finding document");
    });
};
const updateDeliveryStatus = (req, res) => {
  const id = req.params.id;
  const status = req.body.status;

  console.log(status);
  // Find the document in the collection
  // Update a single document
  OrderCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { status: status } }
  );
  res.status(200).send("Updated");
};

module.exports = {
  getAllOrder,
  updateOrder,
  createOrder,
  getAOrder,
  deleteAOrderById,
  updateDeliveryStatus,
};

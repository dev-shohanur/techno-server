const { OrderCollection, defaultSize } = require("../../index.js");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

const getAllOrder = async (req, res) => {
  const cursor = OrderCollection.find({
    $or: [
      { status: "WaitingReview" },
      { status: "OnHold" },
      { status: "making" },
      { status: "ReadyToShip" },
      { status: "Shipped" },
    ],
  });

  const orders = await cursor.sort({ _id: -1 }).toArray();
  res.send(orders);
};
const getAllDefaultSize = async (req, res) => {
  const cursor = defaultSize.find({});

  const sizes = await cursor.sort({ _id: -1 }).toArray();
  res.send(sizes);
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

  await OrderCollection.insertOne(receivedData);
  // Send a response back to the client
  res.json({ message: "Data received successfully" });
};

const getAOrder = (req, res) => {
  const id = req.params.id; // Extract the document ID from the request parameters

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
  try {
    const id = req.params.id;
    const status = req.body.status;

    // Find the document in the collectio
    // Update a single document
    OrderCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: status } }
    );
    res.status(200).send("Updated");
  } catch (error) {
    console.log(error)
    res.status(204).send(error);
  }
};

const updateProductionId = async (req, res) => {
  try {
    const id = req.params.id;
    const productionId = req.body.productionId;
    const index = req.body.index;

    // const dataPath = cart[1].customMade[index].productionId

   const updateProduction = OrderCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { [`cart.1.customMade.${index}.productionId`]: productionId } },
      {new: true}
    );
    res.status(200).send(updateProduction);
  } catch (error) {
    console.log(error)
    res.status(204).send(error);
  }
}

const getLastOrder = async (req, res) => {
  const cursor = OrderCollection.find({}).sort({ _id: -1 }).limit(1);

  const orders = await cursor.toArray();
  res.send(orders);
};

module.exports = {
  getAllOrder,
  updateOrder,
  createOrder,
  getAOrder,
  deleteAOrderById,
  updateDeliveryStatus,
  getLastOrder,
  updateProductionId,
  getAllDefaultSize
};

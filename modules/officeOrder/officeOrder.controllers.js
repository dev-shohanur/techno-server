const { officeOrderCollection } = require("../../index.js");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

const getLastOrder = async (req, res) => {
  const cursor = officeOrderCollection.find({}).sort({ _id: -1 }).limit(1);

  const orders = await cursor.toArray();
  res.send(orders);
};
const createOfficeOrder = async (req, res) => {
  const receivedData = req.body;

  const createdOrder = await officeOrderCollection.insertOne(receivedData);
  // Send a response back to the client
  return res.status(200).json(createdOrder)
};

const updateOrderStatus = (req, res) => {
  try {
    const id = req.params.id;
    const status = req.body.status;

    // Find the document in the collectio
    // Update a single document
    officeOrderCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: status } }
    );
    res.status(200).send("Updated");
  } catch (error) {
    console.log(error)
    res.status(204).send(error);
  }
};

const getOrderByTailor = async (req, res) => {

  const id = req.params.id
  const order = await officeOrderCollection.find({ tailorId: id }).sort({ _id: -1 }).toArray();
  res.send(order);
};

const getAllOfficeOrder = async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const skip = (page - 1) * limit;

  // const data = await client
  //   .db("<your-database-name>")
  //   .collection("<your-collection-name>")
  //   .find()
  //   .skip(skip)
  //   .limit(limit)
  //   .toArray();

  // res.json({ data, totalDocuments });

  const cursor = officeOrderCollection.find({ isDeleted: { $eq: "false" } }).sort({ _id: -1 });


  const orders = await cursor.toArray();
  res.send(orders);
};

const getAOfficeOrder = (req, res) => {
  const id = req.params.id; // Extract the document ID from the request parameters

  console.log(id, "000")

  // Find the document in the collection
  try {
    officeOrderCollection
      .findOne({ _id: new ObjectId(id) })
      .then((document) => {
        if (document) {
          res.json(document); // Send the found document as the response
        }

        console.log(document)
        // else {
        //   res.sendStatus(404); // Send a 404 status code if the document was not found
        // }
      })

  } catch (error) {
    console.error("Error finding document:", error);
    res.status(500).send("Error finding document");
  };
};

const deleteAOfficeOrderById = (req, res) => {
  const id = req.params.id; // Extract the document ID from the request parameters

  // Find the document in the collection
  officeOrderCollection
    .deleteOne({ _id: new ObjectId(id) })
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

module.exports = {
  createOfficeOrder,
  getAllOfficeOrder,
  getAOfficeOrder,
  deleteAOfficeOrderById,
  getLastOrder,
  getOrderByTailor,
  updateOrderStatus
};

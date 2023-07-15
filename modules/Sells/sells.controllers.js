const { ObjectId } = require("mongodb");
const { sellsCollection, OrderCollection } = require("../../index.js");

const getAllSells = async (req, res) => {
  try {
    let sells = await sellsCollection.find({}).toArray();

    res.status(200).json({ sells });
  } catch (err) {
    console.error("Error Create User:", err);
    res.status(500).json({ error: "An error occurred" });
  }
};

const createSell = async (req, res) => {
  const id = req.params.id;

  const order = await OrderCollection.findOne({ _id: new ObjectId(id) });

  console.log(order);

  await sellsCollection.insertOne(order);
  // console.log(result);
  // Send a response back to the client
  res.json({ message: "Data received successfully" });
};

const updateSell = (req, res) => {
  const id = req.params.id; // Extract the document ID from the request parameters
  const updateData = req.body; // Extract the updated data from the request body

  // Update the document in the collection
  sellsCollection
    .updateOne({ _id: new ObjectId(id) }, { $set: updateData })
    .then(() => {
      res.sendStatus(200); // Send a success status code if the update was successful
    })
    .catch((error) => {
      console.error("Error updating document:", error);
      res.status(500).send("Error updating document");
    });
};

const getASell = (req, res) => {
  const id = req.params.id; // Extract the document ID from the request parameters

  console.log(id);
  // Find the document in the collection
  sellsCollection
    .findOne({ _id: new ObjectId(id) })
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
  createSell,
  getAllSells,
  updateSell,
  getASell,
};

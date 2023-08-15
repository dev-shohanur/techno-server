const { ObjectId } = require("mongodb");
const { sales, OrderCollection, productCollection } = require("../../index.js");

const getAllSales = async (req, res) => {
  try {
    let sells = await sales.find({}).toArray();

    res.status(200).json({ sells });
  } catch (err) {
    console.error("Error Create User:", err);
    res.status(500).json({ error: "An error occurred" });
  }
};

const createOnlineSale = async (req, res) => {
  const id = req.params.id;

  const order = await OrderCollection.findOne({ _id: new ObjectId(id) });


  await sales.insertOne(order);
  // Send a response back to the client
  res.json({ message: "Data received successfully" });
};
const createPosSale = async (req, res) => {
  try {
    const order = req.body

   const sale = await sales.insertOne(order);
    // Send a response back to the client
    res.json(sale);
  } catch (error) {
    console.log(error)
    res.json(error);

  }
};

const updateSale = (req, res) => {
  const id = req.params.id; // Extract the document ID from the request parameters
  const updateData = req.body; // Extract the updated data from the request body

  // Update the document in the collection
  sales
    .updateOne({ _id: new ObjectId(id) }, { $set: updateData })
    .then(() => {
      res.sendStatus(200); // Send a success status code if the update was successful
    })
    .catch((error) => {
      console.error("Error updating document:", error);
      res.status(500).send("Error updating document");
    });
};

const getASale = (req, res) => {
  const id = req.params.id; // Extract the document ID from the request parameters

  // Find the document in the collection
  sales
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
  getAllSales,
  updateSale,
  getASale,
  createOnlineSale,
  createPosSale
};

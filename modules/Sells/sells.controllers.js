const { ObjectId } = require("mongodb");
const { sellsCollection, OrderCollection, posSales, productCollection } = require("../../index.js");

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


  await sellsCollection.insertOne(order);
  // Send a response back to the client
  res.json({ message: "Data received successfully" });
};
const createPosSales = async (req, res) => {

  const sale = req.body

  // await sale?.cart?.map( async (product) => {
  //   const finedProduct = await productCollection.findOne({ _id: new ObjectId(product._id) })
    
  //   const updateStock = Number(product?.quantity) - Number(finedProduct.size[product?.size?.slice(',')[0]])

  // })

  await posSales.insertOne(sale);
  // Send a response back to the client
  res.json({ message: "Confirm Sales successfully" });
};
const getAllPosSales = async (req, res) => {

  let sales = await posSales.find({}).toArray();

  res.status(200).json( {sales} );
};
const getAPosSale = async (req, res) => {

  const id = req.params.id

  let sales = await posSales.findOne({ _id: new ObjectId(id) })
  
  console.log(sales)

  res.status(200).json( {sales} );
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
  createPosSales,
  getAllPosSales,
  getAPosSale
};

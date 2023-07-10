const { customerCollection } = require("../../index.js");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

// Log in an existing user
const createCustomer = async (req, res) => {
  try {
    const { name, number, address } = req.body;

    console.log(name, number, address);
    // Find the user in the database
    const customer = await customerCollection.findOne({ number });

    console.log(customer);

    let createNewCustomer = "";

    if (!createNewCustomer === "") {
      const newCustomer = await customerCollection.insertOne({
        name,
        number,
        address,
      });

      createNewCustomer = newCustomer;
    }
    console.log(createNewCustomer);

    // if (createNewCustomer) {
    // return res.status(200).json({ createNewCustomer });
    // }
    !createCustomer === ""
      ? res.status(200).json({ createNewCustomer })
      : res.status(200).json(customer);
  } catch (err) {
    console.error("Error Create User:", err);
    res.status(500).json({ error: "An error occurred" });
  }
};
const getCustomerById = async (req, res) => {
  const id = req.params.id; // Extract the document ID from the request parameters

  console.log(id);
  // Find the document in the collection
  customerCollection
    .findOne({ _id: new ObjectId(id) })
    .then((document) => {
      if (document) {
        console.log(document)
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

const getAllCustomer = async (req, res) => {
  try {
    // Find the user in the database
    const customer = await customerCollection.find({}).toArray();

     res.status(200).json({ customer })
    // res.status(200).json("customer Already created");
  } catch (err) {
    console.error("Error Create User:", err);
    res.status(500).json({ error: "An error occurred" });
  }
};

const updateCustomer = (req, res) => {
  const id = req.params.id; // Extract the document ID from the request parameters
  const updateData = req.body; // Extract the updated data from the request body

  console.log(updateData)

  // Update the document in the collection
  customerCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateData })
    .then(() => {
      res.sendStatus(200); // Send a success status code if the update was successful
    })
    .catch((error) => {
      console.error("Error updating document:", error);
      res.status(500).send("Error updating document");
    });
};

<<<<<<< HEAD
module.exports = {
  createCustomer,
  getAllCustomer,
  getCustomerById,
  updateCustomer,
};
=======
module.exports = { createCustomer, getAllCustomer, getCustomerById, updateCustomer };
>>>>>>> Update With Customer Collection

const { customerCollection } = require("../../index.js");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

// Log in an existing user
const getAllCustomerBySearch = async (req, res) => {
  const search = req.params.key;
  try {
    let customer = await customerCollection
      .find({
        $or: [
          { name: { $regex: ".*" + search + ".*" } },
          { number: { $regex: ".*" + search + ".*" } },
          { address: { $regex: ".*" + search + ".*" } },
        ],
      })
      .toArray();

    // if (customer.length === 0) {
    //   res.status(200).json("no customer");
    // } else {
    res.status(200).json({ customer });
    // }
    // res.status(200).json("customer Already created");
  } catch (err) {
    console.error("Error Create User:", err);
    res.status(500).json({ error: "An error occurred" });
  }
};
const createCustomer = async (req, res) => {
  try {
    const { name, number, address } = req.body;

    // Find the user in the database
    const customer = await customerCollection.findOne({ number });


    let createNewCustomer = "";

    if (!createNewCustomer === "") {
      const newCustomer = await customerCollection.insertOne({
        name,
        number,
        address,
      });

      createNewCustomer = newCustomer;
    }

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

const getAllCustomer = async (req, res) => {
  const search = req.params.key;
  try {
    let customer = await customerCollection.find({}).toArray();

    res.status(200).json({ customer });
  } catch (err) {
    console.error("Error Create User:", err);
    res.status(500).json({ error: "An error occurred" });
  }
};

const updateCustomer = (req, res) => {
  const id = req.params.id; // Extract the document ID from the request parameters
  const updateData = req.body; // Extract the updated data from the request body


  // Update the document in the collection
  customerCollection
    .updateOne({ _id: new ObjectId(id) }, { $set: updateData })
    .then(() => {
      res.sendStatus(200); // Send a success status code if the update was successful
    })
    .catch((error) => {
      console.error("Error updating document:", error);
      res.status(500).send("Error updating document");
    });
};

const getCustomerById = async (req, res) => {
  const id = req.params.id; // Extract the document ID from the request parameters

  // Find the document in the collection
  customerCollection
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
  createCustomer,
  getAllCustomer,
  getCustomerById,
  updateCustomer,
  getAllCustomerBySearch,
};

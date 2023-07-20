const { ObjectId } = require("mongodb");
const { salaryCollection } = require("../../index.js");





const createSalary = async (req, res) => {
  const salary = req.body;


  await salaryCollection.insertOne(salary);
  // Send a response back to the client
  res.json({ message: "Data received successfully" });
};


module.exports = {
  createSalary
};

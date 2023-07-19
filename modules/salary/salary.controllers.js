const { ObjectId } = require("mongodb");
const { salaryCollection } = require("../../index.js");





const createSalary = async (req, res) => {
  const salary = req.body;

  console.log(salary)

  await salaryCollection.insertOne(salary);
  // console.log(result);
  // Send a response back to the client
  res.json({ message: "Data received successfully" });
};


module.exports = {
  createSalary
};

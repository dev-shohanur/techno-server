const { ObjectId } = require("mongodb");
const { expenseCollection } = require("../../index.js");





const createExpense = async (req, res) => {
  const expense = req.body;

  await expenseCollection.insertOne(expense);
  
  // Send a response back to the client
  res.json({ message: "Data received successfully" });
};
const getAllExpense = async (req, res) => {

  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 5
  const search = req.query.search || ''
  let startDate = req.query.startDate || ''; // Replace with the desired start date
  let endDate = req.query.endDate || ''; // Replace with the desired end date
  let category = req.query.category || ''; // Replace with the desired end date

  if (startDate === endDate) {
    startDate = '';
    endDate = '';
  }

  const skip = (page - 1) * limit

  const dateFilter = {};
  if (startDate && endDate) {
    dateFilter.date = { $gte: startDate, $lte: endDate };
  }

  let categoryFilter = { };
  if (category) {
    categoryFilter = {category}
  }


  // let expenses = await expenseCollection.find({}).skip(skip).limit(limit).toArray();

  let expenses = await expenseCollection.aggregate([
    {
      $match: {
        $or: [
          { title: { $regex: ".*" + search + ".*", $options: "i" } },
          { amount: { $regex: ".*" + search + ".*", $options: "i" } },
          { date: { $regex: ".*" + search + ".*", $options: "i" } },
          { category: { $regex: ".*" + search + ".*", $options: "i" } },
          { invoiceId: { $regex: ".*" + search + ".*", $options: "i" } },
          { remark: { $regex: ".*" + search + ".*", $options: "i" } },
        ],
        ...categoryFilter,
        ...dateFilter
      }
    },
    {
      $facet: {
        totalCount: [
          {
            $group: {
              _id: null,
              count: { $sum: 1 }
            }
          },
          {
            $project: {
              _id: 0,
              count: 1
            }
          }
        ],
        postsData: [
          {
            $sort: { _id: -1 } // Sorting in ascending order of serialNumber
          },
          {
            $skip: skip
          },
          {
            $limit: limit
          }
        ]
      }
    },
    {
      $project: {
        totalCount: { $arrayElemAt: ["$totalCount", 0] },
        postsData: 1
      }
    }
  ]).sort({ _id: -1 }).toArray();


  // await expenses

  
  // Send a response back to the client
  if (expenses.length) {
    res.status(200).json({expenses: expenses[0]} );
    
  } else {
    res.status(200).json({
      success: false
    } );
    
  }
};
const getExpenseBySearch = async (req, res) => {

  const search = req.params.key;

  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 5

  const skip = (page - 1) * limit


  const expenses = await expenseCollection.find({
    $or: [
      { title: { $regex: ".*" + search + ".*", $options: "i" } },
      { amount: { $regex: ".*" + search + ".*", $options: "i" } },
      { date: { $regex: ".*" + search + ".*", $options: "i" } },
      { category: { $regex: ".*" + search + ".*", $options: "i" } },
      { invoiceId: { $regex: ".*" + search + ".*", $options: "i" } },
      { remark: { $regex: ".*" + search + ".*", $options: "i" } },
    ],
  }).skip(skip).limit(limit).toArray();
  // Send a response back to the client
 res.status(200).json({ expenses });
};


module.exports = {
  createExpense,
  getAllExpense,
  getExpenseBySearch
};

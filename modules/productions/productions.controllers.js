const { ObjectId } = require("mongodb");
const { productions, productionCategory } = require("../../index.js");




const getCategory = async (req, res) => {

  // console.log("shohan")

  const category = await productionCategory.find({}).toArray();

  res.status(200).json(category);
}
const createProduction = async (req, res) => {

  const production = req.body;

  await productions.insertOne(production)

  res.status(200).json({ success: true });
}
const createCategory = async (req, res) => {

  const category = req.body;

  console.log(category)

  await productionCategory.insertOne(category)

  res.status(200).json({ success: true });
}


const updatePaymentStatus = async (req, res) => {

  try {
    const id = req.params.id
    const status = req.body // The new value for the field you want to update

    const updatedDocument = await productions.updateOne({ _id: new ObjectId(id) }, { $set: { ...status } }) // Update the desired field);

    if (!updatedDocument) {
      return res.status(404).json({ message: 'Document not found' });
    }

    return res.json(updatedDocument);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}


const getThisWeekProduction = async (req, res) => {
  const getSaturdayToCurrentDates = () => {
    const currentDate = new Date();
    const dayOfWeek = currentDate.getDay();

    // Calculate the number of days to subtract to reach the previous Saturday
    const daysToSaturday = dayOfWeek === 6 ? 0 : dayOfWeek + 1;

    const saturday = new Date(currentDate);
    saturday.setDate(currentDate.getDate() - daysToSaturday);

    const dates = [];

    // Generate dates from Saturday to the current day
    while (saturday <= currentDate) {
      dates.push(new Date(saturday));
      saturday.setDate(saturday.getDate() + 1);
    }

    return dates;
  };


  const startDate = getSaturdayToCurrentDates()[0].toISOString()
  const endDate = getSaturdayToCurrentDates()[getSaturdayToCurrentDates().length - 1].toISOString()


  let tailorId = req.query.tailorId || '';

  console.log(tailorId)


  const dateFilter = {};
  if (startDate && endDate) {
    dateFilter.createdAt = { $gte: startDate, $lte: endDate };
  }


  let production = await productions.aggregate([
    {
      $match: {
        ...dateFilter,
        tailorId,

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
          }
        ]
      }
    }
  ]).sort({ _id: -1 }).toArray();


  res.status(200).json(production[0].postsData)

}


const getAllProduction = async (req, res) => {

  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 5
  const search = req.query.search || ''
  let startDate = req.query.startDate || ''; // Replace with the desired start date
  let endDate = req.query.endDate || ''; // Replace with the desired end date
  let category = req.query.category || ''; // Replace with the desired end date
  let tailor = req.query.tailor || ''; // Replace with the desired end date

  if (startDate === endDate) {
    startDate=""
    endDate=""
  }

  const skip = (page - 1) * limit

  const dateFilter = {};
  if (startDate && endDate) {
    dateFilter.createdAt = { $gte: startDate, $lte: endDate };
  }

  let categoryFilter = {};
  if (tailor) {
    categoryFilter = { tailorId: tailor }
  }



  // let expenses = await expenseCollection.find({}).skip(skip).limit(limit).toArray();

  let production = await productions.aggregate([
    {
      $match: {
        ...categoryFilter,
        ...dateFilter,

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
  if (production.length) {
    res.status(200).json({ production: production[0] });

  } else {
    res.status(200).json({
      success: false
    });

  }
};

module.exports = {
  getCategory,
  createCategory,
  createProduction,
  getAllProduction,
  updatePaymentStatus,
  getThisWeekProduction
};

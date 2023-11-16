const { ObjectId } = require("mongodb");
const { productions, productionCategory, customProductions, OrderCollection } = require("../../index.js");
const { Promise } = require("mongoose");




const getCategory = async (req, res) => {
  const category = await productionCategory.find({}).toArray();

  res.status(200).json(category);
}
const getLastCustomProduction = async (req, res) => {
  const production = await customProductions.find({}).sort({ _id: -1 }).limit(1).toArray();

  res.status(200).json(production);
}
const getProductionById = async (req, res) => {

  const {id} = req.params

  const production = await productions.find({tailorId: id,status: "notAccepted"}).toArray();

  res.status(200).json(production);
}
const createProduction = async (req, res) => {

  const production = req.body;

  const result = await productions.insertOne(production)

  res.status(200).json(result);
}

const createCustomProduction = async (req, res) => {
  const production = req.body;

  const result = await customProductions.insertOne(production);

  res.status(200).json(result);
}

const getCustomProductionById = async (req, res) => {

  const { id } = req.params

  const production = await customProductions.findOne({ _id: new ObjectId(id) });

  
  res.status(200).json(production);
}

const getAllCustomProduction = async (req, res) => {
  const production = await customProductions.find({}).toArray();

  res.status(200).json(production)
}

const getTaskByTailorId = async (req, res) => {

  const id = req.params.id
  const production = await customProductions.find({ tailorId: id }).sort({ _id: -1 }).toArray();
  res.send(production);
};

const updateCustomProductionStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.body;

   await customProductions.updateOne(
      { _id: new ObjectId(id) },
     { $set: { status: status.status } }
    );

    const production = await customProductions.findOne({ _id: new ObjectId(id) })

    const order = await OrderCollection.findOne({ _id: new ObjectId(production?.orderId) })
    
    let productions = []
    await Promise.all(
      order.cart[1].customMade.map(async (product) => {
        productions = [await customProductions.findOne({ _id: new ObjectId(product.productionId) }), ...productions]

      })
    )

    const success = productions.filter((item) => item.status === 'success')
    const making = productions.filter((item) => item.status === 'making' || item.status === 'reject' || item.status === 'pending')

    if (order.cart[1].customMade.length === success.length) {
     await OrderCollection.updateOne(
       { _id: new ObjectId(order._id) },
       { $set: { status: "ReadyToShip" } }
      );
    } else if (order.cart[1].customMade.length === making.length) {
      await OrderCollection.updateOne(
        { _id: new ObjectId(order._id) },
        { $set: { status: "making" } }
      );
    } else if (order.cart[1].customMade.length === 0 && order.cart[0].readyMade.length > 0) {
      await OrderCollection.updateOne(
        { _id: new ObjectId(order._id) },
        { $set: { status: "ReadyToShip" } }
      );
    } else {
      await OrderCollection.updateOne(
        { _id: new ObjectId(order._id) },
        { $set: { status: "WaitingReview" } }
      );
    }

    res.status(200).send({success: true});
  } catch (error) {
    console.log(error)
    res.status(204).send(error);
  }
};

const createCategory = async (req, res) => {

  const category = req.body;


  await productionCategory.insertOne(category)

  res.status(200).json({ success: true });
}

const updateRejectedText = async (req, res) => { 
  try {
    const id = req.params.id;
    const rejectData = req.body;

    customProductions.updateOne(
      { _id: new ObjectId(id) },
      {
        $push: {
          rejected: rejectData
        }
      },
      {new: true}
    );
    res.status(200).send("Updated");
  } catch (error) {
    console.log(error)
    res.status(204).send(error);
  }

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
  getThisWeekProduction,
  getProductionById,
  createCustomProduction,
  getCustomProductionById,
  getTaskByTailorId,
  updateCustomProductionStatus,
  getAllCustomProduction,
  updateRejectedText,
  getLastCustomProduction
};

const Sales = require("../models/Sales");
const { generateForecast } = require("../services/predictionService");

// POST /prediction/log-sales
const logSales = async (req, res, next) => {
  try {
    const { date, itemsSold, revenue, notes } = req.body;
    if (itemsSold === undefined || revenue === undefined) {
      res.status(400); throw new Error("itemsSold and revenue are required");
    }
    const sale = await Sales.create({
      vendor: req.user._id,
      date: date || new Date(),
      itemsSold,
      revenue,
      notes,
    });
    res.status(201).json({ success: true, data: sale });
  } catch (err) { next(err); }
};

// GET /prediction/forecast
const getForecast = async (req, res, next) => {
  try {
    const forecast = await generateForecast(req.user._id);
    res.json({ success: true, data: forecast });
  } catch (err) { next(err); }
};

// GET /prediction/history
const getSalesHistory = async (req, res, next) => {
  try {
    const sales = await Sales.find({ vendor: req.user._id })
      .sort({ date: -1 })
      .limit(30)
      .lean();
    res.json({ success: true, count: sales.length, data: sales });
  } catch (err) { next(err); }
};

module.exports = { logSales, getForecast, getSalesHistory };

const Transaction = require("../models/Transaction");

// POST /finance/income
const addIncome = async (req, res, next) => {
  try {
    const { amount, category, note, timestamp } = req.body;
    if (!amount || !category) {
      res.status(400); throw new Error("amount and category are required");
    }
    const tx = await Transaction.create({
      vendor: req.user._id, type: "income", amount, category, note, timestamp,
    });
    res.status(201).json({ success: true, data: tx });
  } catch (err) { next(err); }
};

// POST /finance/expense
const addExpense = async (req, res, next) => {
  try {
    const { amount, category, note, timestamp } = req.body;
    if (!amount || !category) {
      res.status(400); throw new Error("amount and category are required");
    }
    const tx = await Transaction.create({
      vendor: req.user._id, type: "expense", amount, category, note, timestamp,
    });
    res.status(201).json({ success: true, data: tx });
  } catch (err) { next(err); }
};

// GET /finance/summary
const getSummary = async (req, res, next) => {
  try {
    const result = await Transaction.aggregate([
      { $match: { vendor: req.user._id } },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    const income  = result.find((r) => r._id === "income")?.total  || 0;
    const expense = result.find((r) => r._id === "expense")?.total || 0;

    res.json({
      success: true,
      data: {
        totalIncome:  income,
        totalExpense: expense,
        profit:       income - expense,
        profitMargin: income > 0 ? (((income - expense) / income) * 100).toFixed(1) + "%" : "0%",
      },
    });
  } catch (err) { next(err); }
};

// GET /finance/weekly-report
const getWeeklyReport = async (req, res, next) => {
  try {
    const report = await Transaction.aggregate([
      { $match: { vendor: req.user._id } },
      {
        $group: {
          _id: {
            week:  { $isoWeek: "$timestamp" },
            year:  { $isoWeekYear: "$timestamp" },
            type:  "$type",
          },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.week": -1 } },
      { $limit: 20 },
    ]);

    // Transform into chart-ready format
    const weeks = {};
    report.forEach(({ _id, total }) => {
      const key = `W${_id.week}-${_id.year}`;
      if (!weeks[key]) weeks[key] = { week: key, income: 0, expense: 0 };
      weeks[key][_id.type] = total;
    });

    const chartData = Object.values(weeks).map((w) => ({
      ...w,
      profit: w.income - w.expense,
    }));

    res.json({ success: true, data: chartData });
  } catch (err) { next(err); }
};

// GET /finance/transactions
const getTransactions = async (req, res, next) => {
  try {
    const { type, page = 1, limit = 20 } = req.query;
    const filter = { vendor: req.user._id };
    if (type) filter.type = type;

    const txs = await Transaction.find(filter)
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    res.json({ success: true, count: txs.length, data: txs });
  } catch (err) { next(err); }
};

module.exports = { addIncome, addExpense, getSummary, getWeeklyReport, getTransactions };

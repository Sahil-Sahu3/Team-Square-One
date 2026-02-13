
// DEMAND PREDICTION 
//
// Algorithm:
//   1. Take last 7 days of sales records
//   2. Compute simple moving average
//   3. Detect trend (slope via linear regression)
//   4. Return LOW / MEDIUM / HIGH + stock advice


const Sales = require("../models/Sales");

// Simple linear regression: returns slope of y over x
// Positive slope = upward trend, negative = downward
const linearRegressionSlope = (values) => {
  const n = values.length;
  if (n < 2) return 0;

  const xMean = (n - 1) / 2;
  const yMean = values.reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let denominator = 0;

  values.forEach((y, x) => {
    numerator   += (x - xMean) * (y - yMean);
    denominator += (x - xMean) ** 2;
  });

  return denominator === 0 ? 0 : numerator / denominator;
};

const generateForecast = async (vendorId) => {
  // Get last 7 days of sales, oldest first
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentSales = await Sales.find({
    vendor: vendorId,
    date: { $gte: sevenDaysAgo },
  }).sort({ date: 1 });

  // Not enough data yet
  if (recentSales.length === 0) {
    return {
      prediction: "MEDIUM",
      recommendedStockIncrease: "0%",
      reason: "Not enough sales data yet. Log at least 1 day of sales.",
      avgDailySales: 0,
      trend: "neutral",
      daysAnalyzed: 0,
    };
  }

  // Extract items sold per day
  const salesValues = recentSales.map((s) => s.itemsSold);
  const revenueValues = recentSales.map((s) => s.revenue);

  // Moving average
  const avgItems   = salesValues.reduce((a, b) => a + b, 0) / salesValues.length;
  const avgRevenue = revenueValues.reduce((a, b) => a + b, 0) / revenueValues.length;

  // Trend detection via linear regression slope
  const slope = linearRegressionSlope(salesValues);
  const trend = slope > 0.5 ? "increasing" : slope < -0.5 ? "decreasing" : "stable";

  // Classify demand level
  let prediction;
  let recommendedStockIncrease;

  if (trend === "increasing" || avgItems > 50) {
    prediction = "HIGH";
    recommendedStockIncrease = "20%";
  } else if (trend === "decreasing" || avgItems < 15) {
    prediction = "LOW";
    recommendedStockIncrease = "-10%";
  } else {
    prediction = "MEDIUM";
    recommendedStockIncrease = "5%";
  }

  return {
    prediction,
    recommendedStockIncrease,
    avgDailySales: Math.round(avgItems),
    avgDailyRevenue: Math.round(avgRevenue),
    trend,
    daysAnalyzed: recentSales.length,
    reason: `Based on ${recentSales.length} days of data. Trend is ${trend}.`,
    chartData: recentSales.map((s) => ({
      date: s.date.toISOString().split("T")[0],
      itemsSold: s.itemsSold,
      revenue: s.revenue,
    })),
  };
};

module.exports = { generateForecast };

const express = require("express");
const router  = express.Router();
const { logSales, getForecast, getSalesHistory } = require("../controllers/predictionController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);
router.post("/log-sales", logSales);
router.get("/forecast",   getForecast);
router.get("/history",    getSalesHistory);

module.exports = router;

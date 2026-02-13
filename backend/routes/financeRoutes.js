const express = require("express");
const router  = express.Router();
const { addIncome, addExpense, getSummary, getWeeklyReport, getTransactions } = require("../controllers/financeController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);
router.post("/income",         addIncome);
router.post("/expense",        addExpense);
router.get("/summary",         getSummary);
router.get("/weekly-report",   getWeeklyReport);
router.get("/transactions",    getTransactions);

module.exports = router;

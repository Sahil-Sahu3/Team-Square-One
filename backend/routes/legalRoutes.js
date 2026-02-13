const express = require("express");
const router  = express.Router();
const { getArticles, searchArticles, getSafetyGuidelines, seedLegal } = require("../controllers/legalController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);
router.get("/articles",          getArticles);
router.get("/search",            searchArticles);
router.get("/safety-guidelines", getSafetyGuidelines);
router.post("/seed",             seedLegal); // call once to populate DB

module.exports = router;

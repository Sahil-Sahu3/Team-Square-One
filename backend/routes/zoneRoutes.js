const express = require("express");
const router  = express.Router();
const { getZones, getAvailableZones, checkIn, checkOut, createZone } = require("../controllers/zoneController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);
router.get("/",            getZones);
router.get("/availability", getAvailableZones);
router.post("/check-in",   checkIn);
router.post("/check-out",  checkOut);
router.post("/",           createZone);

module.exports = router;

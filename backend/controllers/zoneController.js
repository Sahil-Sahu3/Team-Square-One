const Zone = require("../models/Zone");

// GET /zones — all zones sorted by availability
const getZones = async (req, res, next) => {
  try {
    const { city } = req.query;
    const filter = { isActive: true };
    if (city) filter.city = new RegExp(city, "i");

    const zones = await Zone.find(filter).lean();

    // Add availability field and sort by it
    const withAvailability = zones
      .map((z) => ({ ...z, availability: Math.max(0, z.capacity - z.currentVendors) }))
      .sort((a, b) => b.availability - a.availability);

    res.json({ success: true, count: withAvailability.length, data: withAvailability });
  } catch (err) { next(err); }
};

// GET /zones/availability — only zones with free spots
const getAvailableZones = async (req, res, next) => {
  try {
    const zones = await Zone.find({ isActive: true }).lean();
    const available = zones
      .map((z) => ({ ...z, availability: z.capacity - z.currentVendors }))
      .filter((z) => z.availability > 0)
      .sort((a, b) => b.availability - a.availability);

    res.json({ success: true, count: available.length, data: available });
  } catch (err) { next(err); }
};

// POST /zones/check-in
const checkIn = async (req, res, next) => {
  try {
    const { zoneId } = req.body;
    if (!zoneId) { res.status(400); throw new Error("zoneId is required"); }

    const zone = await Zone.findById(zoneId);
    if (!zone) { res.status(404); throw new Error("Zone not found"); }

    // Already checked in?
    if (zone.checkedInVendors.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: "Already checked in to this zone" });
    }

    // Zone full?
    if (zone.currentVendors >= zone.capacity) {
      return res.status(400).json({ success: false, message: "Zone is at full capacity" });
    }

    zone.checkedInVendors.push(req.user._id);
    zone.currentVendors = zone.checkedInVendors.length;
    await zone.save();

    res.json({
      success: true,
      message: `Checked in to ${zone.name}`,
      data: { zone: zone.name, availability: zone.capacity - zone.currentVendors },
    });
  } catch (err) { next(err); }
};

// POST /zones/check-out
const checkOut = async (req, res, next) => {
  try {
    const { zoneId } = req.body;
    const zone = await Zone.findById(zoneId);
    if (!zone) { res.status(404); throw new Error("Zone not found"); }

    zone.checkedInVendors = zone.checkedInVendors.filter(
      (id) => id.toString() !== req.user._id.toString()
    );
    zone.currentVendors = zone.checkedInVendors.length;
    await zone.save();

    res.json({ success: true, message: `Checked out from ${zone.name}` });
  } catch (err) { next(err); }
};

// POST /zones — seed a zone (admin use during demo)
const createZone = async (req, res, next) => {
  try {
    const zone = await Zone.create(req.body);
    res.status(201).json({ success: true, data: zone });
  } catch (err) { next(err); }
};

module.exports = { getZones, getAvailableZones, checkIn, checkOut, createZone };

const mongoose = require("mongoose");

const zoneSchema = new mongoose.Schema({
  name:           { type: String, required: true, trim: true },
  city:           { type: String, required: true, trim: true },
  coordinates:    { lat: { type: Number }, lng: { type: Number } },
  capacity:       { type: Number, required: true, min: 1 },
  currentVendors: { type: Number, default: 0, min: 0 },
  checkedInVendors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  description:    { type: String, default: "" },
  isActive:       { type: Boolean, default: true },
}, { timestamps: true });

// Virtual: how many spots are free
zoneSchema.virtual("availability").get(function () {
  return Math.max(0, this.capacity - this.currentVendors);
});

zoneSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Zone", zoneSchema);

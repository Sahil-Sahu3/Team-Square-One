const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema({
  vendor:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date:       { type: Date, required: true, default: Date.now },
  itemsSold:  { type: Number, required: true, min: 0 },
  revenue:    { type: Number, required: true, min: 0 },
  notes:      { type: String, default: "" },
}, { timestamps: true });

salesSchema.index({ vendor: 1, date: -1 });

module.exports = mongoose.model("Sales", salesSchema);

const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  vendor:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type:      { type: String, enum: ["income", "expense"], required: true },
  amount:    { type: Number, required: true, min: 0 },
  category:  { type: String, required: true, trim: true },
  note:      { type: String, default: "" },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

transactionSchema.index({ vendor: 1, timestamp: -1 });

module.exports = mongoose.model("Transaction", transactionSchema);

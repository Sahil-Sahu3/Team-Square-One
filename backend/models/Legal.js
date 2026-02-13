const mongoose = require("mongoose");

const legalSchema = new mongoose.Schema({
  title:    { type: String, required: true, trim: true },
  category: { type: String, enum: ["license", "rights", "safety"], required: true },
  content:  { type: String, required: true },
  tags:     { type: [String], default: [] },
}, { timestamps: true });

// Full-text search index
legalSchema.index({ title: "text", content: "text", tags: "text" });

module.exports = mongoose.model("Legal", legalSchema);

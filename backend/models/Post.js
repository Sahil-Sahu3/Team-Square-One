const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  author:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
}, { timestamps: true });

const postSchema = new mongoose.Schema({
  vendor:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title:    { type: String, required: true, trim: true, maxlength: 120 },
  content:  { type: String, required: true },
  category: {
    type: String,
    enum: ["issue", "alert", "pricing", "safety", "general"],
    default: "general",
  },
  votes:    { type: Number, default: 0 },
  votedBy:  [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [commentSchema],
}, { timestamps: true });

postSchema.index({ votes: -1, createdAt: -1 });

module.exports = mongoose.model("Post", postSchema);

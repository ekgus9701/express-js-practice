const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: {
      type: String,
      required: true,
    },
    author: String,
    createdAt: { type: Date, default: Date.now },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

boardSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "board",
});

const Board = mongoose.model("Board", boardSchema);

module.exports = Board;

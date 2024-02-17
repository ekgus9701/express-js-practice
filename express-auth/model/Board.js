const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      //required: true,
    },

    img: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

boardSchema.set("timestamps", {
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

boardSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "board",
});

const Board = mongoose.model("Board", boardSchema);

module.exports = Board;

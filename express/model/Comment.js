const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  writer: { type: String, required: true },

  content: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  board: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board",
    required: true,
  },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;

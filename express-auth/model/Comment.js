const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  writer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  content: {
    type: String,
    required: true,
  },

  board: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board",
    //required: true,
  },
});

commentSchema.set("timestamps", {
  createdAt: "createdAt",
  updatedAt: "updateAt",
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;

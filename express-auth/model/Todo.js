const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  // writer: {
  //   type: mongoose.Types.ObjectId,
  //   //required: true,
  //   ref: "User",
  // },
  // createdAt: { type: Date, default: Date.now },
  // updatedAt: { type: Date, default: Date.now },
});

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;

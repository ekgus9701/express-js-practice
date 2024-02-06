const mongoose = require("mongoose");
const watcha = require("./Watcha.js");

const watchaSchema = new mongoose.Schema({
  code: { type: String, required: true },
  content_type: { type: String, required: true },
  title: { type: String, required: true },
  year: { type: Number, required: true },
  poster: {
    hd: { type: String, required: true },
    xlarge: { type: String, required: true },
    large: { type: String, required: true },
    medium: { type: String, required: true },
    small: { type: String, required: true },
  },
  badges: [
    {
      service: { type: String, required: true },
      name: { type: String, required: true },
      image: { type: String, required: true },
    },
  ],
  on_watchaplay: { type: Boolean, required: true },
  ratings_avg: { type: Number, required: true },
  director_names: [{ type: String, required: true }],
  stillcut: {
    original: { type: String, required: true },
    fullhd: { type: String, required: true },
    xlarge: { type: String, required: true },
    large: { type: String, required: true },
    medium: { type: String, required: true },
    small: { type: String, required: true },
  },
  nations: [{ name: { type: String, required: true } }],
  genres: [{ type: String, required: true }],
  current_context: { type: String },
});

const Watcha = mongoose.model("Watcha", watchaSchema);

module.exports = Watcha;

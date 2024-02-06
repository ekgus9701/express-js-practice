const mongoose = require("mongoose");

const watchaCommentSchema = new mongoose.Schema({
  code: { type: string, required: true },
  user: {
    code: { type: string, required: true },
    name: { type: string, required: true },
    photo: {
      original: { type: string, required: true },
      large: { type: string, required: true },
      small: { type: string, required: true },
    },
    watcha_play_user: { type: boolean, required: true },
    official_user: { type: boolean, required: true },
  },
  text: { type: string, required: true },
  likes_count: { type: number, required: true },
  replies_count: { type: number, required: true },
  content_code: { type: string, required: true },
  user_code: { type: string, required: true },
  watched_at: { type: ["string", "null"], required: true },
  spoiler: { type: boolean, required: true },
  improper: { type: boolean, required: true },
  replyable: { type: boolean, required: true },
  created_at: { type: string, required: true },
  user_content_action: {
    rating: { type: number, required: true },
    status: { type: ["string", "null"], required: true },
    mehed: { type: boolean, required: true },
    watched_at: { type: ["string", "null"], required: true },
    user_code: { type: string, required: true },
    content_code: { type: string, required: true },
  },
  watcha: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Watcha",
    required: true,
  },
});

const WatchaComment = mongoose.model("WatchaComment", watchaCommentSchema);

module.exports = WatchaComment;

import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  modId: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Comment', CommentSchema);
import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  modId: {
    type: Number,
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

const Commet = mongoose.model('Comment', CommentSchema);

export default Commet;
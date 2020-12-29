const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  visits: {
    type: Number,
    default: 0
  },
  body: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  tag: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
    required: true,
  },
});

const Blog = mongoose.model("Blog", BlogSchema);

module.exports = Blog;

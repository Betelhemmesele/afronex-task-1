
  const mongoose = require('mongoose');

// Define the Comment schema
const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  }
}, { timestamps: true });

// Define the BlogPost schema
const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
 
  date: {
    type: Date,
    required: true
  },
  categories: {
    type: [String],
    required: true
  },
  imageUrls:{
    type:Array,
    required:true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comments: [commentSchema]
}, { timestamps: true });

// Define the BlogPost model
const BlogPost = mongoose.model('BlogPost', blogPostSchema);

// Export the model
module.exports = BlogPost;
const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar:{
    type:String,
    default:"https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small/default-avatar-profile-icon-of-social-media-user-vector.jpg"
  },
},
  { timestamps: true },
);
// Define the User model
const User = mongoose.model('User', userSchema);
// Export the models
module.exports = {User};
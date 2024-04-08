const {User} =require('../models/user.js');
const {BlogPost} = require('../models/blog');
const errorHandler =require( '../utils/error.js');
const bcrypt = require('bcrypt');
const test =(req,res) => {
   
        res.json({
            message:"Welcome to our site",
        });
     }
     const updateUser = async (req, res, next) => {
      if (req.user.id !== req.params.id) {
        return next(errorHandler(401, "You can only update your own account."));
      }
    
      try {
        if (req.body.password) {
          req.body.password = await bcrypt.hash(req.body.password, 10);
        }
    
        const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          {
            $set: {
              username: req.body.username,
              email: req.body.email,
              password: req.body.password,
              avatar: req.body.avatar,
            },
          },
          { new: true }
        );
    
        // if (!updatedUser) {
        //   return next(errorHandler(404, "User not found."));
        // }
        console.log("uodated", updatedUser);
        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
        console.log(rest);
      } catch (error) {
        console.log(error);
      }
    };

 const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can only delete your own account"));
  }

  try {
    const user = await User.findById(req.params.id);
    console.log(user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await User.findByIdAndDelete(req.params.id); // Delete the user from the database

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
  };
 
 

const getUserBlogs =async (req,res,next)=>{
    if (req.user.id === req.params.id){
        try {
            const blog = await BlogPost.find({user: req.params.id});
            res.status(200).json(task);
        } catch (error) {
            next(error);
        }
    }
    else{
        return next(errorHandler(401,'you can only view yours'));
    }
}
const getUser = async (req, res, next) => {
    try {
      
      const user = await User.findById(req.params.id);
    
      if (!user) return next(errorHandler(404, 'User not found!'));
    
      const { password: pass, ...rest } = user._doc;
    
      res.status(200).json(rest);
    } catch (error) {
      next(error);
    }
  };
  module.exports={
    test,
    updateUser,
    deleteUser,
    getUserBlogs,
    getUser,
  };
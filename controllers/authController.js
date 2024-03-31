const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user.js');
const { errorHandler } = require('../utils/error.js');

// User registration
const register = async (req, res, next) => {
  try {
    const { fullname, username, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      fullname,
      username,
      email,
      password: hashedPassword
    });

    // Save the user to the database
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    next(errorHandler(550, 'error from the function'));
  }
};

// User login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(404, 'user not found!'));
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(errorHandler(401, 'wrong credential!'));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const { password: pass, ...restInfo } = user._doc;
    
    res.cookie('access_token',
     token, 
     { httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
     }).status(200).json(restInfo);
  } catch (error) {
    next(error);
  }
};
const signout = (req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('user has been logged out ');
  } catch (error) {
    console.log("error",error);
    next(error);
  }
};

module.exports = { register, login, signout };
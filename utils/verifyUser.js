const { verify } = require('jsonwebtoken');
const { errorHandler } = require("./error.js");

const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  console.log("token",token);

  if (!token) {
    return next(errorHandler(401, 'Unauthorized user'));
  }

  verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(403, 'Forbidden'));
    }

    req.user = user;
    console.log("user",req.user)
    next();
  });
};

module.exports = { verifyToken };
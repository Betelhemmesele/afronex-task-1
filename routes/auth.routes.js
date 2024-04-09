const express = require('express');
const router = express.Router();
const { register, login, signout } = require('../controllers/authController.js');
const { verifyToken } = require('../utils/verifyUser.js');

router.post('/register', register);
router.post('/login', login);
router.get('/signout',verifyToken, signout);

module.exports = router;
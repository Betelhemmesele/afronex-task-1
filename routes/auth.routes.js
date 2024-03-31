const express = require('express');
const router = express.Router();
const { register, login, signout } = require('../controllers/authController.js');

router.post('/register', register);
router.post('/login', login);
router.get('/signout', signout);

module.exports = router;
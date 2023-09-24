// importing modules 
const express = require('express'); 
const router = express.Router(); 

// Import the controller for this route
const controller = require('../controllers/authController');

// Define the routes
router.get('/register', controller.register);
router.get('/register', controller.login);

module.exports = router;
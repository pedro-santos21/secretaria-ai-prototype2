// importing modules 
const express = require('express'); 
const router = express.Router(); 

// Import the controller for this route
const controller = require('../controllers/authController');

// Define the routes
router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/test', (req:any, res:any) => {
    res.send("Hello!")
})

module.exports = router;
const Model = require('../models/User');

// Define controller methods
const register = (req: any, res: any) => {
  // Register user
  console.log("Register request")
};

const login = (req: any, res: any) => {
  // Login user
  console.log("Login request")
};

module.exports = {
  register,
  login
};

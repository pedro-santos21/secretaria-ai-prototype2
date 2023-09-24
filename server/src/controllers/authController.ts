const userModel = require('../models/User');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator');

interface RegisterRequest {
    body: {
      name: string;
      email: string;
      password: string;
    };
  }
  

// (Code inspired by https://youtu.be/7ZEbBhDXk60)

// Define controller methods
const register = async (req: RegisterRequest, res: any) => {
  // Register user
  console.log("Register request")
  // Sanitize inputs
  await body('name').trim().escape().run(req);
  await body('email').trim().escape().normalizeEmail().isEmail().run(req);
  await body('password').trim().escape().run(req);

  // Validate inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new userModel({
    name,
    email,
    password: hashedPassword
  })

  user.save().then((user: any) => {
    res.status(200).json({
        success:true,
        message: "User registered successfully",
        user: {
            id : user._id,
            username : user.username
        }
    }).then((user:any) => {
        const payload = {
            username: user.username,
            id: user._id,
          };
      
          const token = jwt.sign(payload, process.env.JWT_SECRET!, 
            { expiresIn: process.env.JWT_TOKEN_DURATION_REGISTER });
    })
  }).catch((err: any) => {
    res.status(500).json({
        success:false,
        message: "Something went wrong",
        error: err
    })
  })
};

interface LoginRequest {
    body: {
      username: string;
      password: string;
    };
}

const login = async (req: LoginRequest, res: any) => {
    // Login user
    console.log("Login request")

    // Sanitize inputs
    await body('username').trim().escape().run(req);
    await body('password').trim().escape().run(req);

    // Validate inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { username, password } = req.body;

        const user = await userModel.findOne({ username });

        if (!user) {
            return res.status(401).json({
            success: false,
            message: 'Could not find the user.',
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
            success: false,
            message: 'Wrong password.',
            });
        }

        const payload = {
            username: user.username,
            id: user._id,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_TOKEN_DURATION_LOGIN,
        });

        return res.status(200).json({
            success: true,
            message: 'User logged in successfully!',
            token: `Bearer ${token}`,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Something went wrong.',
            error: err,
        });
    }
};

module.exports = {
  register,
  login
};

const userModel = require('../models/User');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
import type {Request, Response} from 'express';

interface AuthRequest {
    body: {
      username: string;
      email: string;
      password: string;
    };
  }
  
// (Code inspired by https://youtu.be/7ZEbBhDXk60)

// Define controller methods
const register = async (req: AuthRequest, res: Response) => {
  // Register user
  console.log("Register request")

  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new userModel({
    username: username,
    email: email,
    password: hashedPassword
  })

  user.save().then((user: any) => {

    const payload = {
        username: user.username,
        id: user._id,
      };
  
    const token = jwt.sign(payload, process.env.JWT_SECRET!, 
    { expiresIn: process.env.JWT_TOKEN_DURATION_REGISTER });

    res.status(200).json({
        success:true,
        message: "User registered successfully",
        user: {
            id : user._id,
            username : user.username,
            token: `Bearer ${token}`
        }
    })
  }).catch((err: any) => {
    res.status(500).json({
        success:false,
        message: "Something went wrong. Error message: " + err,
        error: err
    })
  })
};

const login = async (req: AuthRequest, res: any) => {
    // Login user
    console.log("Login request")
    try {
        const { username, email, password } = req.body;

        const user = await userModel.findOne({ $or: [{ username }, { email }] });

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

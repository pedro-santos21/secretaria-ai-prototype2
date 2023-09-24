const userModel = require('../models/User');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
import type {Request, Response} from 'express';
import { issueJWT, validatePassword } from '../lib/authUtils';
const crypto = require('crypto');
const authUtils = require('../lib/authUtils')

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

  const saltHash = await authUtils.genPassword(password);

  const user = new userModel({
    username: username,
    email: email,
    salt: saltHash.salt,
    hash: saltHash.hash
  })

  user.save().then((user: any) => {

    const issuedJWT = authUtils.issueJWT(user);

    res.status(200).json({
        success:true,
        message: "User registered successfully",
        user: {
            id : user._id,
            username : user.username,
            token: issuedJWT.token,
            expiresIn: issuedJWT.expires
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

        const isPasswordValid = await authUtils.validatePassword(password, user.hash, user.salt)

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Wrong password.',
            });
        }

        const issuedJWT = authUtils.issueJWT(user);

        return res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            token: issuedJWT.token,
            expiresIn: issuedJWT.expires
        });
    }catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong. Error message: " + err,
            error: err,
        });
    }
};

module.exports = {
  register,
  login
};

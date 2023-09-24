// Express Imports
import express, {Request, Response} from "express";
const router = express.Router()

// 3rd party Imports
import mongoose from "mongoose";
import cors from "cors";
import passport from "passport";
require('dotenv').config()
const helmet = require('helmet')
const session = require('express-session')

const app = express();
const path = require('path');
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(passport.initialize());
app.use(passport.session());
app.use(
  session({
  secret: 'illuminati-party', //pick a random string to make the hash that is generated secure
  resave:false,
  saveUnitialized:true
}))
app.use(function(req, res, next) {
  console.log('Session:', req.session);
  next();
});

// Security
app.disable('x-powered-by') // Reduce fingerpinting

// Database
connectToDatabase().catch(err => console.log(err))
async function connectToDatabase() {
    await mongoose.connect(<string>process.env.MONGODB_KEY);
    console.log("+ Connected to MongoDB");
}

// Routes
app.use('/', express.static(path.join(__dirname, 'public')))
app.use('/', require('./routes/root'))
app.use('/users', require('.routes/userRoutes'))

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
   console.info(`Backend server is listening on http://localhost:${port}`);
 });
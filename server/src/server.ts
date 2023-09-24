// Express Imports
import express, {Request, Response} from "express";
const router = express.Router()

// 3rd party Imports
import mongoose from "mongoose";
import cors from "cors";
const bodyParser = require("body-parser");
require('dotenv').config()
const helmet = require('helmet')
const session = require('express-session')
const passport = require('passport')

const app = express();
const path = require('path');
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false })); 

//// Passport
//app.use(passport.initialize());
//app.use(passport.session());

//// Sessions
/*app.use(
  session({
  secret: process.env.SESSION_SECRET, //pick a random string to make the hash that is generated secure
  resave:false,
  saveUninitialized:true
}))*/

// Security
app.disable('x-powered-by') // Reduce fingerpinting

// Database
connectToDatabase().catch(err => console.log(err))
async function connectToDatabase() {
    await mongoose.connect(<string>process.env.MONGODB_KEY);
    console.log("+ Connected to MongoDB");
}

// Routes
const publicDir = path.join(__dirname, 'public')
app.use('/', express.static(publicDir))

//app.use('/', require('./routes/root'))
//app.use('/users', require('./routes/userRoute'))
app.use('/api/auth', require('./routes/authRoute'))
app.use('/api/user', require('./routes/userRoute'))

// Other code
app.get("/", (req, res) => {
    res.send("Hello World!");
});

// Start server
app.listen(port, () => {
   console.info(`Backend server is listening on http://localhost:${port}`);
 });
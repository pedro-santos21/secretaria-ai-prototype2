// Express Imports
import express, {Request, Response} from "express";
const router = express.Router()

// 3rd party Imports
import cors from "cors";
const bodyParser = require("body-parser");
const dotenv = require('dotenv')
dotenv.config()
const helmet = require('helmet')
const session = require('express-session')
const passport = require('passport')

// My Imports
require('./models/User');

async function authSetup() {
  await require("./config/rsa").setupRSAKeyPaths();
  require('./config/passport')(passport);
} authSetup();

import { printMongooseState, startMongo } from "./config/database"

// const logger = require('./config/logging').SetupWinstonLogger(); [NOTE: FIX THIS LATER AND SET THIS UP!!!!!!!!!!!11]

const app = express();
const path = require('path');
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false })); 

// This will initialize the passport object on every request
app.use(passport.initialize());

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
startMongo().then(() => {
  printMongooseState();
});

// Routes
const publicDir = path.join(__dirname, 'public')
app.use('/', express.static(publicDir))

//app.use('/', require('./routes/root'))
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
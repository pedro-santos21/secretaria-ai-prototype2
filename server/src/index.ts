import express from "express";
import mongoose from "mongoose";
import cors from "cors";
require('dotenv').config()

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

connectToDatabase().catch(err => console.log(err))

async function connectToDatabase() {
    await mongoose.connect(<string>process.env.MONGODB_KEY);
    console.log("+ Connected to MongoDB");
}

app.get("/", (req, res) => {
    res.send("Hello World!");
  });

app.listen(port, () => {
   console.info(`Backend server is listening on http://localhost:${port}`);
 });
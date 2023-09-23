import express from "express";

const app = express();
const port = 3000;

// Middleware
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
  });

app.listen(port, () => {
   console.info(`Backend server is listening on http://localhost:${port}`);
 });
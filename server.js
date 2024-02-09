const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = 3001;

const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Hello from Node.js backend!");
});

app.get("/fetch-institutes", async (req, res) => {
  try {
    const response = await axios.get("https://assist.org/api/institutions");
    res.send(response.data); // Send data back to the client
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

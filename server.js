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




const mongoose = require('mongoose');

// const mongoURL = `mongodb+srv://STAR:Star1234@cluster0.enlwlxx.mongodb.net/Star`;
const mongoURL =`mongodb+srv://Star:Star1234@cluster0.gsnssvn.mongodb.net/STAR`;

// CONNECT TO MONGO
const connectDB = async () => {
    try {
      await mongoose.connect(mongoURL);

      // Get a list of collection names in the "Star" database
      const collections = await mongoose.connection.db.listCollections().toArray();

      console.log('Collections in "Star" database:');
      collections.forEach(collection => {
          console.log(collection.name);
      });

      // Close the connection
      mongoose.connection.close();
    } catch (error) {
        console.error(error);
    }
};


module.exports = { connectDB };


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
  connectDB();
});

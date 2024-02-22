const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const port = 3001;

const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

const mongoURL = `mongodb+srv://Star:Star1234@cluster0.gsnssvn.mongodb.net/STAR`;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Connection to MongoDB failed:", error);
  }
};

const Schools = mongoose.model(
  "School",
  new mongoose.Schema(
    {
      name: String,
      location: String,
    },
    { collection: "Schools" }
  )
);

const Programs = mongoose.model(
  "Program",
  new mongoose.Schema(
    {
      s_id: String,
      name: String,
      department: String,
    },
    { collection: "Programs" }
  )
);

const CSULA_Courses = mongoose.model(
  "CSULA_Course",
  new mongoose.Schema(
    {
      subject_code: Array,
      course_name: String,
      department: Array,
      credits: String,
      category: String,
    },
    { collection: "CSULA_Courses" }
  )
);

const Courses = mongoose.model(
  "Course",
  new mongoose.Schema(
    {
      subject_code: Array,
      course_name: String,
      department: Array,
      credits: String,
      category: String,
    },
    { collection: "Courses" }
  )
);

module.exports = { connectDB };

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Hello from Node.js backend!");
});

app.get("/fetch-institutes", async (req, res) => {
  try {
    const allData = await Schools.find({});
    res.json(allData);
  } catch (error) {
    console.error("Error fetching schools:", error);
    res.status(500).json({ error: "An error occurred while fetching schools" });
  }
});

app.get("/fetch-programs", async (req, res) => {
  const { collegeId } = req.query;
  try {
    const programs = await Programs.find({ s_id: collegeId });
    console.log("programs", programs);

    res.json(programs);
    console.log(`Programs for college ID ${collegeId}:`, programs);
  } catch (error) {
    console.error("Error fetching programs:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching programs" });
  }
});

// New endpoint for fetching CSULA courses
app.get("/fetch-csula-courses", async (req, res) => {
  const { dept } = req.query;
  try {
    const csulaCourses = await CSULA_Courses.find({ "department.id": dept });
    console.log("CSULA courses", csulaCourses);

    res.json(csulaCourses);
    console.log("Fetched CSULA courses:", csulaCourses);
  } catch (error) {
    console.error("Error fetching CSULA courses:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching CSULA courses" });
  }
});

// New endpoint for fetching courses by s_id
app.get("/fetch-courses", async (req, res) => {
  const { sid } = req.query;
  try {
    const courses = await Courses.find({ s_id: sid });
    console.log("Courses for s_id:", courses);

    res.json(courses);
    console.log(`Fetched courses for s_id ${sid}:`, courses);
  } catch (error) {
    console.error("Error fetching courses by s_id:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching courses by s_id" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  connectDB();
});

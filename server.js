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
const Schema = mongoose.Schema;

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
      course_code: Array,
      course_name: String,
      department: Array,
      credits: String,
      category: String,
      block_type: String,
    },
    { collection: "CSULA_Courses" }
  )
);

const Courses = mongoose.model(
  "Course",
  new mongoose.Schema(
    {
      course_code: Array,
      course_name: String,
      department: Array,
      credits: String,
      category: String,
    },
    { collection: "Courses" }
  )
);

const blockSchema = new Schema(
  {
    name: String,
    desc: String,
    req_credits: Number,
  },
  { _id: false }
);

const DeptReqBlocks = mongoose.model(
  "DeptReqBlocks",
  new mongoose.Schema(
    {
      name: String,
      dept_id: String,
      blocks: Array,
    },
    { collection: "dept_req_blocks" }
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
    res.status(500).json({ error: "An error occurred while fetching schools" });
  }
});

app.get("/fetch-programs", async (req, res) => {
  const { collegeId } = req.query;
  try {
    const programs = await Programs.find({ s_id: collegeId });
    res.json(programs);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching programs" });
  }
});

// Function to determine block type for a course
async function determineBlockType(course, departmentData) {
  // console.log("3", course, departmentData);
  try {
    if (departmentData && departmentData.blocks) {
      // console.log("4", departmentData.blocks);
      for (const block of departmentData.blocks) {
        console.log(
          "first",
          course,
          course.course_code,
          course?.block_type,
          block.block_id
        );
        if (course.block_type && course.block_type === block.block_id) {
          return block.block_id;
        }
      }
    }
  } catch (error) {
    console.error("Error determining block type:", error);
  }
  return null;
}

app.get("/fetch-csula-courses", async (req, res) => {
  const { dept } = req.query;
  try {
    const departmentData = await DeptReqBlocks.findOne({ dept_id: dept });
    const csulaCourses = await CSULA_Courses.find({ "department.id": dept });

    const blockWiseCourses = {};
    const coursesWithoutBlock = [];

    for (const course of csulaCourses) {
      if (course.block_type) {
        const blockType = await determineBlockType(course, departmentData);
        if (blockType) {
          if (!blockWiseCourses[blockType]) {
            blockWiseCourses[blockType] = [];
          }
          blockWiseCourses[blockType].push(course);
        } else {
          coursesWithoutBlock.push(course);
        }
      } else {
        coursesWithoutBlock.push(course);
      }
    }

    res.json({ blockWiseCourses, coursesWithoutBlock });
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
    res.json(courses);
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

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Grid, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CourseCard from "../../components/CourseCard/CourseCard";
import { getNextTerm, getTermLabel, toSentenceCase } from "../../utils";
import "../../pages/CourseSelection/courseSelectionStyle.css";
import BlockModal from "../../components/BlockModal/BlockModal";
import Badge from "@mui/material/Badge";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useDispatch } from "react-redux";
import { addCourse, reset } from "../../slices/selectedCourseSlice";

export default function RemainingCourseList(params) {
  const location = useLocation();
  const dispatch = useDispatch();
  const [termData, setTermData] = useState([]);
  const [courseListData, setCourseListData] = useState([]);
  const [checkboxResponses, setCheckboxResponses] = useState({});
  const navigate = useNavigate();
  const [navigationCount, setNavigationCount] = useState(0);
  const {
    program,
    startTerm,
    startYear,
    uncheckedMatchedCsulaCourses,
    csulaCourseList,
  } = location.state || {};
  const [genEduCourse, setGenEduCourse] = useState([]);
  const [currentTerm, setCurrentTerm] = useState(startTerm.value);
  const [currentYear, setCurrentYear] = useState(startYear);
  const [courseList, setCourseList] = useState(csulaCourseList);

  const [courses, setCourses] = useState([]);

  const handleUpdateCourse = (updatedCourse) => {
    setCourses((prevCourses) => {
      // Find the index of the existing course with the same _id
      const index = prevCourses.findIndex(
        (course) => course._id === updatedCourse._id
      );

      // If the course already exists in the state, update it
      if (index !== -1) {
        const newCourses = [...prevCourses];
        newCourses[index] = updatedCourse;
        return newCourses;
      }

      // If the course doesn't exist, add it to the array
      return [...prevCourses, updatedCourse];
    });
  };

  const handleCheckboxChange = (courseId, isChecked) => {
    setCheckboxResponses((prevState) => ({
      ...prevState,
      [courseId]: isChecked,
    }));
  };

  const goToSelectedCoursesPage = () => {
    const selectedCourses = csulaCourseList.filter(
      (course) => checkboxResponses[course._id]
    );

    const selectedCoursesWithTerm = selectedCourses.map((course) => ({
      ...course,
      selected_term: {},
    }));

    const uncheckedCourses = csulaCourseList.filter(
      (course) => !checkboxResponses[course._id]
    );
    console.log("precheck", selectedCoursesWithTerm);
    dispatch(addCourse(selectedCoursesWithTerm));
    console.log("commentedcourses", courses, courses.length);

    // localStorage.setItem("commentedCourses", JSON.stringify(courses));
    // console.log("Commented courses : ", courses);
    // console.log("start term in ramainingCourseList ", startTerm);

    navigate("/course-selection", {
      state: {
        program,
        startTerm,
        courseList: uncheckedCourses,
        startYear,
      },
    });
  };
  return (
    <>
      <Box>
        <Typography variant="h5" textTransform={"uppercase"} pt={5}>
          Please justify relevant work if any
        </Typography>
        <Box px={{ sm: 15, xs: 5 }} py={10}>
          <Grid container spacing={5}>
            {uncheckedMatchedCsulaCourses.map((course) => (
              <Grid key={course._id} item xs={6} sm={4}>
                <CourseCard
                  enableCheckbox={false}
                  hoverable={false}
                  course={course}
                  isChecked={checkboxResponses[course._id]}
                  //   onCheckboxChange={(isChecked) =>
                  //     handleCheckboxChange(course._id, isChecked)
                  //   }
                  addComment={true}
                  handleUpdateCourse={handleUpdateCourse}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
        <div
          className="floating-button"
          style={{
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: "-80px",
          }}
        >
          <Button
            variant="contained"
            onClick={goToSelectedCoursesPage}
            style={{
              backgroundColor: "#FFCE00",
              borderRadius: 7,
            }}
          >
            <Typography variant="p" px={5} textTransform={"none"} fontSize={16}>
              Next
            </Typography>{" "}
            <NavigateNextIcon />
          </Button>
        </div>
      </Box>
    </>
  );
}

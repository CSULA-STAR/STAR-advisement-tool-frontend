import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Grid, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CourseCard from "../../components/CourseCard/CourseCard";
import "../../pages/CourseSelection/courseSelectionStyle.css";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useDispatch } from "react-redux";
import { addCourse } from "../../slices/selectedCourseSlice";

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
    console.log("updatedCourse", updatedCourse);
    setCourses((prevCourses) => {
      const index = prevCourses.findIndex(
        (course) => course._id === updatedCourse._id
      );

      if (index !== -1) {
        const newCourses = [...prevCourses];
        newCourses[index] = updatedCourse;
        return newCourses;
      }

      return [...prevCourses, updatedCourse];
    });
  };

  const handleCheckboxChange = (courseId, isChecked) => {
    console.log("Logging the state of checkbox : ", isChecked);
    setCheckboxResponses((prevState) => ({
      ...prevState,
      [courseId]: isChecked,
    }));
  };

  // 1. Checkbox checked==> enbable add comment
  // 2. commented courses should added to selected term courses before adding to store
  // 3. Add validfation to Next button, if any course is selected, it should have a non empty comment

  const goToSelectedCoursesPage = () => {
    const selectedCourses = csulaCourseList.filter(
      (course) => checkboxResponses[course._id]
    );

    console.log("selectedCourses ", selectedCourses);

    const prevSelectedString = localStorage.getItem("selectedCourses");
    const prevSelectedArray = prevSelectedString
      ? JSON.parse(prevSelectedString)
      : [];

    const selectedCoursesWithTerm = selectedCourses.map((course) => ({
      ...course,
      selected_term: {},
    }));

    const commentedCoursesWithTerm = courses.map((course) => ({
      ...course,
      selected_term: {},
    }));

    //Comment Validations
    const allCoursesCommented = selectedCourses.every((course) => {
      const courseToCheck = commentedCoursesWithTerm.find(
        (commentedCourse) => commentedCourse._id === course._id
      );
      return (
        courseToCheck &&
        courseToCheck.comment &&
        courseToCheck.comment.trim() !== ""
      );
    });

    if (!allCoursesCommented) {
      const courseWithoutComment = selectedCourses.find((course) => {
        const courseToCheck = commentedCoursesWithTerm.find(
          (commentedCourse) => commentedCourse._id === course._id
        );
        return (
          !courseToCheck ||
          !courseToCheck.comment ||
          courseToCheck.comment.trim() === ""
        );
      });
      if (courseWithoutComment) {
        alert(
          `Please provide a valid comment for ${courseWithoutComment.course_name}`
        );
      }
    } else {
      console.log("selectedCoursesWithTerm ", selectedCoursesWithTerm);
      const combinedCourseswithTerm = [
        ...prevSelectedArray,
        ...commentedCoursesWithTerm,
      ];

      console.log("combinedCourseswithTerm ", combinedCourseswithTerm);
      const uncheckedCourses = csulaCourseList.filter(
        (course) => !checkboxResponses[course._id]
      );
      console.log("precheck", combinedCourseswithTerm);
      dispatch(addCourse(combinedCourseswithTerm));
      console.log("commentedcourses", courses, courses.length);

      // localStorage.setItem("commentedCourses", JSON.stringify(courses));
      console.log("Commented courses : ", courses);
      console.log("start term in ramainingCourseList ", startTerm);
      console.log("uncheckedCourses", uncheckedCourses);

      const updatedCourses = combinedCourseswithTerm.map((course) => {
        return {
          ...course,
          selected_term: { term: "Transferable Courses ", year: "" },
        };
      });

      navigate("/course-selection", {
        state: {
          program,
          startTerm,
          courseList: uncheckedCourses,
          startYear,
          prevCourses: updatedCourses,
        },
      });
    }
  };

  useEffect(() => {}, [checkboxResponses]);
  return (
    <>
      <Box>
        <Typography variant="h6" textTransform={"uppercase"} pt={5}>
          Please justify relevant work if any
        </Typography>
        <Box px={{ sm: 15, xs: 5 }} py={10}>
          <Grid container spacing={5}>
            {uncheckedMatchedCsulaCourses.length > 0 ? (
              uncheckedMatchedCsulaCourses.map((course) => (
                <Grid key={course._id} item xs={6} sm={4}>
                  <CourseCard
                    enableCheckbox={true}
                    hoverable={false}
                    course={course}
                    onCheckboxChange={handleCheckboxChange}
                    addComment={checkboxResponses[course._id]}
                    handleUpdateCourse={handleUpdateCourse}
                  />
                </Grid>
              ))
            ) : (
              <Box textAlign={"center"} margin="auto">
                <h3>No courses available for selection</h3>
              </Box>
            )}
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

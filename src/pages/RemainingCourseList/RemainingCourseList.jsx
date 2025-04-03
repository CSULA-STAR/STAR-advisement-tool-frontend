import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { Button, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import CourseCard from "../../components/CourseCard/CourseCard";
import { addCourse } from "../../slices/selectedCourseSlice";

export default function RemainingCourseList() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [checkboxResponses, setCheckboxResponses] = useState({});
  const navigate = useNavigate();
  const {
    program,
    startTerm,
    startYear,
    uncheckedMatchedCsulaCourses,
    csulaCourseList,
  } = location.state || {};

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Load saved checkbox state from localStorage if it exists
    const savedCheckboxState = localStorage.getItem("remainingCourseListCheckboxState");
    const savedCourses = localStorage.getItem("remainingCourseListCourses");
    
    if (savedCheckboxState) {
      try {
        const parsedState = JSON.parse(savedCheckboxState);
        console.log("Restoring checkbox state:", parsedState);
        setCheckboxResponses(parsedState);
      } catch (error) {
        console.error("Error parsing checkbox state:", error);
      }
    }

    if (savedCourses) {
      try {
        const parsedCourses = JSON.parse(savedCourses);
        console.log("Restoring courses with comments:", parsedCourses);
        setCourses(parsedCourses);
      } catch (error) {
        console.error("Error parsing courses:", error);
      }
    }
  }, []);

  const handleUpdateCourse = (updatedCourse) => {
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
    setCheckboxResponses((prevState) => ({
      ...prevState,
      [courseId]: isChecked,
    }));
  };

  const goToSelectedCoursesPage = () => {
    const selectedCourses = csulaCourseList.filter(
      (course) => checkboxResponses[course._id]
    );

    const prevSelectedString = localStorage.getItem("selectedCourses");
    const prevSelectedArray = prevSelectedString
      ? JSON.parse(prevSelectedString)
      : [];

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
      const combinedCourseswithTerm = [
        ...prevSelectedArray,
        ...commentedCoursesWithTerm,
      ];

      const uncheckedCourses = csulaCourseList.filter(
        (course) => !checkboxResponses[course._id]
      );
      dispatch(addCourse(combinedCourseswithTerm));

      const updatedCourses = combinedCourseswithTerm.map((course) => {
        return {
          ...course,
          selected_term: { term: "Transferable Courses ", year: "" },
        };
      });

      // Save location state to localStorage
      localStorage.setItem("remainingCourseListLocationState", JSON.stringify({
        program,
        startTerm,
        startYear,
        uncheckedMatchedCsulaCourses,
        csulaCourseList
      }));

      // Save checkbox responses and courses with comments
      localStorage.setItem("remainingCourseListCheckboxState", JSON.stringify(checkboxResponses));
      localStorage.setItem("remainingCourseListCourses", JSON.stringify(courses));

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

  const backToCourseListPage = () => {
    // Save location state to localStorage
    localStorage.setItem("remainingCourseListLocationState", JSON.stringify({
      program,
      startTerm,
      startYear,
      uncheckedMatchedCsulaCourses,
      csulaCourseList
    }));

    // Save checkbox responses and courses with comments
    localStorage.setItem("remainingCourseListCheckboxState", JSON.stringify(checkboxResponses));
    localStorage.setItem("remainingCourseListCourses", JSON.stringify(courses));

    // Get the previous saved state from localStorage
    const savedState = localStorage.getItem("courseListLocationState");
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      navigate("/courselist", {
        state: parsedState
      });
    } else {
      navigate("/courselist");
    }
  };

  useEffect(() => {}, [checkboxResponses]);
  return (
    <>
      <Box>
        <Typography variant="h6" textTransform={"uppercase"} pt={5}>
          Please select courses and add comments to justify your selections
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
                    isChecked={checkboxResponses[course._id] || false}
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
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <Button
            variant="contained"
            onClick={backToCourseListPage}
            style={{
              backgroundColor: "#FFCE00",
              borderRadius: 7,
            }}
          >
            <NavigateBeforeIcon />
            <Typography variant="p" px={5} textTransform={"none"} fontSize={16}>
              Back
            </Typography>
          </Button>
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

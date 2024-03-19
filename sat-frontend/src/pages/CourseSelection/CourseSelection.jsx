import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CourseCard from "../../components/CourseCard";
import { getNextTerm, getTermLabel } from "../../utils";

export const CourseSelection = () => {
  const [data, setData] = useState([]);
  const [checkboxResponses, setCheckboxResponses] = useState({});
  const navigate = useNavigate();
  const [navigationCount, setNavigationCount] = useState(0);
  const location = useLocation();
  const { courseList, term } = location.state || {};
  let startYear = location.state.startYear;
  const handleCheckboxChange = (courseId, isChecked) => {
    setCheckboxResponses({ ...checkboxResponses, [courseId]: isChecked });
  };
  useEffect(() => {
    const termCourseList = courseList.filter((course) => {
      return course.term.includes(getTermLabel(term));
    });
    setData(termCourseList);
  }, [courseList, term]);

  const handleNextClick = () => {
    let checkedCourses = courseList.filter(
      (course) => checkboxResponses[course._id]
    );
    let existingCourses = localStorage.getItem("selectedCourses");
    existingCourses = existingCourses ? JSON.parse(existingCourses) : [];

    checkedCourses = checkedCourses.map((course) => ({
      ...course,
      selected_term: term,
      startYear: startYear,
    }));

    let newCourses = [...existingCourses, ...checkedCourses];

    localStorage.setItem("selectedCourses", JSON.stringify(newCourses));

    console.log(localStorage.getItem("selectedCourses"));
    const filteredCourseList = courseList.filter(
      (course) => !checkboxResponses[course._id]
    );
    if (navigationCount < 5) {
      startYear = navigationCount === 2 ? startYear + 1 : startYear;
      console.log("startyeaInselection" + startYear);
      navigate("/course-selection", {
        state: {
          courseList: filteredCourseList,
          term: getNextTerm(term),
          startYear,
        },
      });
      setNavigationCount(navigationCount + 1);
    } else {
      navigate("/selected-courses", {
        state: {
          courseList: filteredCourseList,
          startYear,
        },
      });
    }
  };

  return (
    <Box sx={{ textAlign: "center" }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        padding={3}
      >
        <Typography variant="h4" component="div">
          {getTermLabel(term)} {startYear}
        </Typography>
        <Box>
          {/* <Button>Skip</Button> */}
          <Button variant="contained" onClick={handleNextClick}>
            Next
          </Button>
        </Box>
      </Stack>
      <Box sx={{ padding: 3 }}>
        <Grid container spacing={2}>
          {data.map((course) => (
            <Grid item key={course._id} xs={12} sm={6} md={4} lg={3}>
              <CourseCard
                enableCheckbox
                hoverable={true}
                course={course}
                addComment={true}
                onCheckboxChange={(isChecked) =>
                  handleCheckboxChange(course._id, isChecked)
                }
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CourseCard from "../../components/CourseCard";
import { getNextTerm, getTermLabel } from "../../utils";
import React from "react";
import "../../pages/CourseSelection/courseSelectionStyle.css";

export const CourseSelection = () => {
  const course_types = [
    "upper_division",
    "lower_division",
    "general_education",
    "senior_design",
    "technical_elective",
  ];
  const blocks = [
    "block_c",
    "block_d",
    "block_a1",
    "block_a2",
    "us_constitution",
    "us_history",
    "block_e",
  ];

  const block_types = {
    block_c: "Block C",
    block_d: "Block D",
    block_a1: "Block A1",
    block_a2: "Block A2",
    us_constitution: "US Constitution",
    us_history: "US History",
    block_e: "Block E",
  };

  const types = {
    upper_division: "Upper Division",
    lower_division: "Lower Division",
    general_education: "General Education",
    senior_design: "Senior Design",
    technical_elective: " Technical Elective",
  };

  const [data, setData] = useState([]);
  const [checkboxResponses, setCheckboxResponses] = useState({});
  const navigate = useNavigate();
  const [navigationCount, setNavigationCount] = useState(0);
  const [dataByBlock, setDataByBlock] = useState([]);
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

    const blockCourses = termCourseList.filter((course) => {
      return course.course_type === "general_education";
    });

    setDataByBlock(blockCourses);

    console.log("Block courses ", blockCourses);
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
          <Button>Skip</Button>
          <Button variant="contained" onClick={handleNextClick}>
            Next
          </Button>
        </Box>
      </Stack>
      <Box sx={{ padding: 3 }}>
        <Grid container spacing={2}>
          {course_types.map((header) => (
            <div key={header}>
              <div className="course_type">
                <h1>{types[header]}</h1>
              </div>
              <Grid container spacing={2} style={{ padding: 20 }}>
                {header === "general_education"
                  ? blocks.map((block) => {
                      const blockCourses = data.filter(
                        (course) =>
                          course.course_type === header &&
                          course.block_type === block
                      );

                      if (blockCourses.length > 0) {
                        return (
                          <React.Fragment key={block}>
                            <Grid item xs={12}>
                              <Typography className="blockTitle" variant="h5">
                                {block_types[block]}
                              </Typography>
                            </Grid>
                            {blockCourses.map((course) => (
                              <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                lg={4}
                                key={course._id}
                              >
                                <CourseCard
                                  enableCheckbox
                                  course={course}
                                  onCheckboxChange={(isChecked) =>
                                    handleCheckboxChange(course._id, isChecked)
                                  }
                                />
                              </Grid>
                            ))}
                          </React.Fragment>
                        );
                      } else {
                        return null;
                      }
                    })
                  : data
                      .filter((course) => course.course_type === header)
                      .map((course) => (
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={4}
                          lg={4}
                          key={course._id}
                        >
                          <CourseCard
                            enableCheckbox
                            course={course}
                            onCheckboxChange={(isChecked) =>
                              handleCheckboxChange(course._id, isChecked)
                            }
                          />
                        </Grid>
                      ))}
              </Grid>
            </div>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default CourseSelection;

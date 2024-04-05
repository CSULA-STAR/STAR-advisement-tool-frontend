import { Box, Button, Grid, Stack, Typography, Card } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CourseCard from "../../components/CourseCard";
import CourseSelectorModal from "../../components/CourseSelectorModal/CourseSelectorModal";
import { getBlockNameById, getNextTerm, getTermLabel } from "../../utils";
import "./CourseSelectionStyle.css";

export const CourseSelection = () => {
  const [courseBlocks, setCourseBlocks] = useState([]);
  const [modalData, setModalData] = useState([]);

  const [openCourseModal, setOpenCourseModal] = useState(false);
  const [courseTypesData, setCourseTypesData] = useState([]);
  const [courses, setCourses] = useState();

  const [checkboxResponses, setCheckboxResponses] = useState({});
  const navigate = useNavigate();
  const [navigationCount, setNavigationCount] = useState(0);
  const location = useLocation();
  const { program, courseList, term } = location.state || {};
  let startYear = location.state?.startYear;
  const handleCheckboxChange = (courseId, isChecked) => {
    setCheckboxResponses({ ...checkboxResponses, [courseId]: isChecked });
  };
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        console.log("program", program);
        const courses = await axios.get(
          `http://localhost:3001/fetch-csula-courses?dept=${program.department}`
        );
        const course_blocks = await axios.get(
          `http://localhost:3001/fetch-req-block-details?dept=${program.department}`
        );
        const course_types = await axios.get(
          "http://localhost:3001/course-types"
        );

        setCourses(courses.data);
        setCourseBlocks(course_blocks.data);
        setCourseTypesData(course_types.data[0].types);
      } catch (error) {
        console.error("Error fetching course types", error);
      }
    };

    fetchCourses();
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

    console.log("localStrorage..", localStorage.getItem("selectedCourses"));
    const filteredCourseList = courseList.filter(
      (course) => !checkboxResponses[course._id]
    );
    if (navigationCount < 5) {
      startYear = navigationCount === 2 ? startYear + 1 : startYear;
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
  const handleCourseCardClick = (courseDetails) => {
    setModalData(courseDetails);
    setOpenCourseModal(true);
  };

  const handleModalClose = () => {
    setOpenCourseModal(false);
  };
  console.log("courseBlocks", courseBlocks);
  return (
    <>
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
          {courseTypesData?.map((item) => (
            <>
              {item.id === "general_education" ? (
                <>
                  <Typography key={item.id} variant="h5">
                    {item.name}
                  </Typography>
                  <Grid container spacing={2}>
                    {courses.blockWiseCourses?.map((course) => (
                      <Grid item key={course._id} xs={12} sm={6} md={4} lg={3}>
                        <Box>
                          <CourseCard
                            onClick={() => handleCourseCardClick(course.course)}
                            enableCheckbox
                            course={{
                              course_code: [
                                getBlockNameById(
                                  courseBlocks.blocks,
                                  course.type
                                ),
                              ],
                              course_name: "",
                              credits: "3",
                            }}
                            onCheckboxChange={(isChecked) =>
                              handleCheckboxChange(course._id, isChecked)
                            }
                          />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </>
              ) : (
                <>
                  <Typography
                    key={item.id}
                    variant="h5"
                    className="type_heading"
                  >
                    {item.name}
                  </Typography>
                  <Grid container spacing={2}>
                    {courses?.coursesWithoutBlock
                      .filter((course) => course.course_type === item.id)
                      .map((course) => (
                        <Grid
                          item
                          key={course._id}
                          xs={12}
                          sm={6}
                          md={4}
                          lg={3}
                        >
                          <CourseCard
                            onClick={handleCourseCardClick}
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
                </>
              )}
            </>
          ))}
        </Box>
      </Box>
      <CourseSelectorModal
        openModal={openCourseModal}
        handleModalClose={handleModalClose}
        courses={modalData}
        // handleSubmit={}
      />
    </>
  );
};

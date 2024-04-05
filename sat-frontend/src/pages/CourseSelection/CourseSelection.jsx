import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CourseCard from "../../components/CourseCard";
import CourseSelectorModal from "../../components/CourseSelectorModal/CourseSelectorModal";
import { getBlockNameById, getNextTerm, toSentenceCase } from "../../utils";
import "./CourseSelectionStyle.css";

export const CourseSelection = () => {
  const [courseBlocks, setCourseBlocks] = useState([]);
  const [modalData, setModalData] = useState([]);

  const [openCourseModal, setOpenCourseModal] = useState(false);
  const [courseTypesData, setCourseTypesData] = useState([]);
  const [courses, setCourses] = useState();
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [checkboxResponses, setCheckboxResponses] = useState({});
  const navigate = useNavigate();
  const [navigationCount, setNavigationCount] = useState(0);
  const location = useLocation();
  const { program, courseList, startTerm } = location.state || {};

  useEffect(() => {
    const fetchCourses = async () => {
      try {
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
  }, [courseList, startTerm]);

  const handleCheckboxChange = (courseId, isChecked) => {
    setCheckboxResponses({ ...checkboxResponses, [courseId]: isChecked });
    toggleCourseSelection(courseId);
  };

  const handleNextClick = () => {
    let checkedCourses = courseList.filter(
      (course) => checkboxResponses[course._id]
    );
    let existingCourses = localStorage.getItem("selectedCourses");
    existingCourses = existingCourses ? JSON.parse(existingCourses) : [];

    checkedCourses = checkedCourses.map((course) => ({
      ...course,
      startTerm: startTerm,
    }));

    let newCourses = [...existingCourses, ...checkedCourses];

    localStorage.setItem("selectedCourses", JSON.stringify(newCourses));

    const filteredCourseList = courseList.filter(
      (course) => !checkboxResponses[course._id]
    );

    const nextTerm = getNextTerm(startTerm);
    const nextYear =
      nextTerm === "spring" ? startTerm.year + 1 : startTerm.year;

    if (navigationCount < 5) {
      navigate("/course-selection", {
        state: {
          courseList: filteredCourseList,
          startTerm: { term: nextTerm, year: nextYear },
        },
      });
      setNavigationCount(navigationCount + 1);
    } else {
      navigate("/selected-courses", {
        state: {
          courseList: filteredCourseList,
          startYear: startTerm.year,
        },
      });
    }
  };

  const handleCourseCardClick = (courseDetails) => {
    setModalData(courseDetails);
    setOpenCourseModal(true);
  };

  const handleCourseCardSubmit = () => {
    const selectedCoursesData = courseList.filter(
      (course) => checkboxResponses[course._id]
    );

    console.log("Selected courses:", selectedCoursesData);
    // Close the modal
    handleModalClose();
  };

  const handleModalClose = () => {
    setOpenCourseModal(false);
  };

  const toggleCourseSelection = (courseId) => {
    setSelectedCourses((prevSelected) => {
      if (prevSelected.includes(courseId)) {
        return prevSelected.filter((id) => id !== courseId);
      } else {
        return [...prevSelected, courseId];
      }
    });
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
            {toSentenceCase(startTerm.term)} {startTerm.year}
          </Typography>
          <Box>
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
                            selected={selectedCourses.includes(course._id)}
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
        // onSelectCourse={handleCourseCardClick}
        onSubmit={handleCourseCardSubmit}
      />
    </>
  );
};

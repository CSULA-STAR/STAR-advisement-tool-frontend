import ForwardRoundedIcon from "@mui/icons-material/ForwardRounded";
import { Box, Button, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CourseCard from "../../components/CourseCard/CourseCard";
import "./CourseListStyle.css";
import { blocks, types } from "../../constants";
import { useDispatch } from "react-redux";
import { reset } from "../../slices/selectedCourseSlice";
import { addAllCourse } from "../../slices/allCoursesSlice";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const CourseList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { program, college, startTerm, startYear } = location.state;
  const [matchedCourses, setMatchedCourses] = useState([]);
  const [csulaCourseList, setCsulaCourseList] = useState([]);
  const [checkboxResponses, setCheckboxResponses] = useState({});
  const [courseTypes, setCourseTypes] = useState([]);

  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  useEffect(() => {
    if (program && college) {
      const fetchCourses = async () => {
        try {
          const csulaResponse = await axios.get(
            `http://localhost:3001/fetch-all-csula-courses?dept=${program.department}`
          );
          const filteredCourses = csulaResponse.data.filter((course) => course);
          setCsulaCourseList(filteredCourses);

          const selectedSchoolResponse = await axios.get(
            `http://localhost:3001/fetch-courses?sid=${college.id}`
          );
          const typesResponse = await axios.get(
            `http://localhost:3001/course-types`
          );

          const idsArray = typesResponse.data[0].types.map((type) => type.id);
          setCourseTypes(idsArray);

          const { matched } = findMatchingCourses(
            csulaResponse.data,
            selectedSchoolResponse.data
          );
          dispatch(addAllCourse(filteredCourses));
          setMatchedCourses(matched);

          const initialCheckboxResponses = {};
          matched.forEach(({ csulaCourse }) => {
            initialCheckboxResponses[csulaCourse._id] = false;
          });
          setCheckboxResponses(initialCheckboxResponses);
        } catch (error) {
          console.error("Error fetching courses:", error);
        }
      };

      fetchCourses();
    }
  }, [program, college, dispatch]);

  const findMatchingCourses = (csulaCourses, selectedSchoolCourses) => {
    const matched = [];
    const remainingCsula = [];
    csulaCourses.forEach((csulaCourse) => {
      const match = selectedSchoolCourses.find((selectedCourse) =>
        intersectArrays(csulaCourse.course_code, selectedCourse.equivalent_to)
      );
      if (match) {
        matched.push({ csulaCourse, selectedCourse: match });
      } else {
        remainingCsula.push(csulaCourse);
      }
    });
    return { matched, remainingCsula };
  };

  const handleCheckboxChange = (courseId, isChecked) => {
    setCheckboxResponses((prevState) => ({
      ...prevState,
      [courseId]: isChecked,
    }));
  };

  const goToUnselectedCoursesPage = () => {
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

    const uncheckedMatchedCsulaCourses = matchedCourses
      .filter(({ csulaCourse }) => !checkboxResponses[csulaCourse._id])
      .map(({ csulaCourse }) => csulaCourse);

    localStorage.setItem(
      "selectedCourses",
      JSON.stringify(selectedCoursesWithTerm)
    );

    navigate("/justify-unselected", {
      state: {
        program,
        startTerm,
        courseList: uncheckedCourses,
        startYear: startYear.value,
        uncheckedMatchedCsulaCourses,
        csulaCourseList,
      },
    });
  };

  if (!program || !college) {
    return <div>Error: Missing program or college props</div>;
  }

  let selectedSchoolHeadingRendered = false;
  let csulaHeadingRendered = false;

  return (
    <Box className="course-list-container" component="div">
      <Typography
        variant="h6"
        padding="20px 0"
        textTransform="uppercase"
        fontWeight="600"
      >
        Please select the courses you have taken in {college.name}
      </Typography>
      {courseTypes.map((courseType) => {
        const matchedForThisType = matchedCourses.filter(
          ({ csulaCourse }) => csulaCourse.course_type === courseType
        );

        return matchedForThisType.length > 0 ? (
          <Box key={courseType}>
            <div
              className="course_type"
              style={{
                display: "flex",
                textAlign: "center",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="h5" paddingTop="auto">
                {types[courseType]}
              </Typography>
            </div>
            <Box className="course-group">
              <Box>
                <div
                  className="row"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    textAlign: "center",
                    margin: "30px 0",
                  }}
                >
                  <div className="column">
                    {!selectedSchoolHeadingRendered && (
                      <Typography
                        variant="h6"
                        display="inline-block"
                        fontWeight="bold"
                        pl={10}
                      >
                        {college?.name}
                      </Typography>
                    )}
                  </div>
                  <div className="columnCalstate column">
                    {!csulaHeadingRendered && (
                      <Typography
                        variant="h6"
                        display="inline-block"
                        fontWeight="bold"
                        pr={12}
                      >
                        California State University
                      </Typography>
                    )}
                  </div>
                </div>
                {matchedForThisType.map(({ csulaCourse, selectedCourse }) => (
                  <Box className="course-row" key={csulaCourse._id}>
                    {csulaCourse.course_type === "general_education" ? (
                      blocks
                        .filter((block) => csulaCourse.block_type === block)
                        .map((block) => (
                          <div key={block} className="course-row">
                            <Box className="college-column" width={360}>
                              <CourseCard
                                enableCheckbox
                                hoverable={false}
                                course={selectedCourse}
                                isChecked={checkboxResponses[csulaCourse._id]}
                                onCheckboxChange={(isChecked) =>
                                  handleCheckboxChange(
                                    csulaCourse._id,
                                    isChecked
                                  )
                                }
                              />
                              {(selectedSchoolHeadingRendered = true)}
                            </Box>
                            <div className="arrow-column">
                              <div
                                className="arrow-column-content"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  height: "100%",
                                  marginLeft: 100,
                                  marginRight: 100,
                                }}
                              >
                                <ForwardRoundedIcon style={{ fontSize: 40 }} />
                              </div>
                            </div>
                            <Box className="college-column" width={360}>
                              <CourseCard
                                enableCheckbox={false}
                                course={csulaCourse}
                              />
                              {(csulaHeadingRendered = true)}
                            </Box>
                          </div>
                        ))
                    ) : (
                      <div className="course-row" key={csulaCourse._id}>
                        <Box className="college-column" width={360}>
                          {!selectedSchoolHeadingRendered && (
                            <Typography
                              variant="h6"
                              textAlign="center"
                              padding="20px 0"
                            >
                              {college?.name}
                            </Typography>
                          )}
                          <CourseCard
                            enableCheckbox
                            hoverable={false}
                            course={selectedCourse}
                            isChecked={checkboxResponses[csulaCourse._id]}
                            onCheckboxChange={(isChecked) =>
                              handleCheckboxChange(csulaCourse._id, isChecked)
                            }
                          />
                          {(selectedSchoolHeadingRendered = true)}
                        </Box>
                        <div className="arrow-column">
                          <div
                            className="arrow-column-content"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              height: "100%",
                              marginLeft: 100,
                              marginRight: 100,
                            }}
                          >
                            <ForwardRoundedIcon style={{ fontSize: 40 }} />
                          </div>
                        </div>
                        <Box className="college-column" width={360}>
                          {!csulaHeadingRendered && (
                            <Typography
                              variant="h6"
                              textAlign="center"
                              padding="20px 0"
                            >
                              Cal State LA Courses
                            </Typography>
                          )}
                          <CourseCard
                            enableCheckbox={false}
                            course={csulaCourse}
                          />
                          {(csulaHeadingRendered = true)}
                        </Box>
                      </div>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        ) : null;
      })}
      <div className="floating-button">
        <Button
          variant="contained"
          onClick={goToUnselectedCoursesPage}
          style={{ backgroundColor: "#FFCE00", borderRadius: 7 }}
        >
          <Typography variant="p" px={5} textTransform="none" fontSize={16}>
            Next
          </Typography>
          <NavigateNextIcon />
        </Button>
      </div>
    </Box>
  );
};

const intersectArrays = (array1, array2) => {
  return array1.some((element) => array2.includes(element));
};

export default CourseList;

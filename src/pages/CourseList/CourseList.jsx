import ForwardRoundedIcon from "@mui/icons-material/ForwardRounded";
import { Box, Button, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CourseCard from "../../components/CourseCard/CourseCard";
import "./CourseListStyle.css";
import { blocks, block_types } from "../../constants";
import { useDispatch } from "react-redux";
import { addCourse, reset } from "../../slices/selectedCourseSlice";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const CourseList = () => {
  const types = {
    upper_division: "Upper Division",
    lower_division: "Lower Division",
    general_education: "General Education",
    senior_design: "Senior Design",
    technical_elective: "Technical Elective",
  };

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { program, college, startTerm, startYear } = location.state;
  const [matchedCourses, setMatchedCourses] = useState([]);
  const [csulaCourseList, setCsulaCourseList] = useState([]);
  const [checkboxResponses, setCheckboxResponses] = useState({});
  const [course_types, setCourseTypes] = useState([]);

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
          let filteredCourses = csulaResponse.data.filter((course) => course);
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
  }, [program, college]);

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
    setCheckboxResponses((prevState) => {
      // Check if the courseId already exists and if it's not already false
      const alreadyChecked = prevState[courseId] && prevState[courseId] !== false;

      return {
        ...prevState,
        [courseId]: alreadyChecked ? false : isChecked
      };
    });
};

  const goToUnselectedCoursesPage = () => {
    const selectedCourses = csulaCourseList.filter(
      (course) => checkboxResponses[course._id]
    );

    console.log("Checkbox responses : ", checkboxResponses);

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

    console.log("uncheckedMatchedCsulaCourses ", uncheckedMatchedCsulaCourses);
    console.log(" uncheckedCourses : ", uncheckedCourses);

    console.log("Selected courses for localStorage ", selectedCoursesWithTerm);

    localStorage.setItem(
      "selectedCourses",
      JSON.stringify(selectedCoursesWithTerm)
    );

    console.log("csulaCourseList Before sending ", csulaCourseList);
    console.log("startYear", startYear);

    console.log("uncheckedCourses " , uncheckedCourses);
    console.log("uncheckedMatchedCsulaCourses ", uncheckedMatchedCsulaCourses);

    navigate("/justify-unselected", {
      state: {
        program,
        startTerm,
        courseList: uncheckedCourses,
        startYear: startYear.value,
        uncheckedMatchedCsulaCourses: uncheckedMatchedCsulaCourses,
        csulaCourseList: csulaCourseList,
      },
    });
  };

  if (!program || !college) {
    return <div>Error: Missing program or college props</div>;
  }

  let selectedSchoolHeadingRendered = false;
  let csulaHeadingRendered = false;

  return (
    <Box className="course-list-container" component={"div"}>
      <Typography
        variant="h6"
        padding={"20px 0"}
        textTransform={"uppercase"}
        fontWeight={"600"}
      >
        Please select the courses you have taken in {college.name}
      </Typography>
      {course_types.map((course_type) => {
        const matchedForThisType = matchedCourses.filter(
          ({ csulaCourse }) => csulaCourse.course_type === course_type
        );

        return matchedForThisType.length > 0 ? (
          <Box key={course_type}>
            <div
              className="course_type"
              style={{
                display: "flex",
                textAlign: "center",
                justifyContent: "center",
                alignItem: "center",
              }}
            >
              <Typography variant="h5" paddingTop={"auto"}>
                {types[course_type]}
              </Typography>
            </div>
            <Box className="course-group">
              <Box>
                <div
                  className="row"
                  style={{
                    display: "flex",
                    flextDirection: "row",
                    justifyContent: "space-between",
                    textAlign:"center",
                    margin: "30px 0",
                  }}
                >
                  <div className="column">
                    {!selectedSchoolHeadingRendered && (
                      <Typography
                        variant="h6"
                        display={"inline-block"}
                        fontWeight={"bold"}
                        pl={10}
                      >
                        {college?.name}
                      </Typography>
                    )}
                  </div>
                  <div
                    className="columnCalstate column"
                    
                  >
                    {!csulaHeadingRendered && (
                      <Typography
                        variant="h6"
                        display={"inline-block"}
                        fontWeight={"bold"}
                        
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
                             
                             enableCheckbox={true}
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
                              textAlign={"center"}
                              padding={"20px 0"}
                            >
                              {college?.name}
                            </Typography>
                          )}
                          <CourseCard
                            enableCheckbox={true}
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
                              textAlign={"center"}
                              padding={"20px 0"}
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
          <Typography variant="p" px={5} textTransform={"none"} fontSize={16}>
            Next
          </Typography>{" "}
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

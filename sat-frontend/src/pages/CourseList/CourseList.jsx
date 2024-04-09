import ForwardRoundedIcon from "@mui/icons-material/ForwardRounded";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CourseCard from "../../components/CourseCard";
import "./CourseListStyle.css";
import { Button } from "@material-ui/core";
import { blocks, block_types } from "../../constants";

const CourseList = () => {
  const types = {
    upper_division: "Upper Division",
    lower_division: "Lower Division",
    general_education: "General Education",
    senior_design: "Senior Design",
    technical_elective: " Technical Elective",
  };

  const navigate = useNavigate();
  const location = useLocation();
  const { program, college, startTerm, startYear } = location.state;
  const [matchedCourses, setMatchedCourses] = useState([]);
  const [csulaCourseList, setCsulaCourseList] = useState([]);
  const [checkboxResponses, setCheckboxResponses] = useState({});
  const [course_types, setCourseTypes] = useState([]);

  console.log("Location", program, college, startTerm, startYear);
  useEffect(() => {
    localStorage.removeItem("selectedCourses");
  }, [location.state]);

  useEffect(() => {
    if (program && college) {
      const fetchCourses = async () => {
        try {
          const csulaResponse = await axios.get(
            `http://localhost:3001/fetch-all-csula-courses?dept=${program.department}`
          );
          console.log("csulaResponse", csulaResponse.data);
          let filteredCourses = csulaResponse.data.filter((course) => course);
          console.log("-->filteredCourses", filteredCourses);
          setCsulaCourseList(filteredCourses);
          const selectedSchoolResponse = await axios.get(
            `http://localhost:3001/fetch-courses?sid=${college.id}`
          );
          console.log("-->27", selectedSchoolResponse.data);

          const typesResponse = await axios.get(
            `http://localhost:3001/course-types`
          );

          const idsArray = typesResponse.data[0].types.map((type) => type.id);
          console.log("Types Name : ", idsArray);
          setCourseTypes(idsArray);
          const { matched, remainingCsula } = findMatchingCourses(
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

    console.log("Selected courses for localStorage ", selectedCoursesWithTerm);

    localStorage.setItem(
      "selectedCourses",
      JSON.stringify(selectedCoursesWithTerm)
    );

    navigate("/course-selection", {
      state: {
        program,
        startTerm,
        courseList: uncheckedCourses,
        startYear: startYear.value,
      },
    });
  };

  if (!program || !college) {
    return <div>Error: Missing program or college props</div>;
  }

  console.log("csulaCourseList", csulaCourseList);
  console.log("matchedCourses", matchedCourses);

  let selectedSchoolHeadingRendered = false;
  let csulaHeadingRendered = false;

  return (
    <div className="course-list-container">
      {course_types.map((course_type) => {
        const matchedForThisType = matchedCourses.filter(
          ({ csulaCourse }) => csulaCourse.course_type === course_type
        );

        return matchedForThisType.length > 0 ? (
          <div key={course_type}>
            <div className="course_type">
              <h2>{types[course_type]}</h2>
            </div>
            <div className="course-group">
              {matchedForThisType.map(({ csulaCourse, selectedCourse }) => (
                <div className="course-row" key={csulaCourse._id}>
                  {csulaCourse.course_type === "general_education" ? (
                    blocks
                      .filter((block) => csulaCourse.block_type === block)
                      .map((block) => (
                        <div key={block} style={{ width: "100%" }}>
                          <h2 className="blockTitle">{block_types[block]}</h2>
                          <div className="course-row">
                            <div className="college-column">
                              {!selectedSchoolHeadingRendered && (
                                <h2>{college?.name}</h2>
                              )}
                              <CourseCard
                                enableCheckbox={true}
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
                            </div>
                            <div className="arrow-column">
                              <div
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
                            <div className="college-column">
                              {!csulaHeadingRendered && (
                                <h2>Cal State LA Courses</h2>
                              )}
                              <CourseCard
                                enableCheckbox={false}
                                course={csulaCourse}
                              />
                              {(csulaHeadingRendered = true)}
                            </div>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div style={{ display: "flex", width: "100%" }}>
                      <div className="college-column">
                        {!selectedSchoolHeadingRendered && (
                          <h2>{college?.name}</h2>
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
                      </div>
                      <div className="arrow-column">
                        <div
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
                      <div className="college-column">
                        {!csulaHeadingRendered && <h2>Cal State LA Courses</h2>}
                        <CourseCard
                          enableCheckbox={false}
                          course={csulaCourse}
                        />
                        {(csulaHeadingRendered = true)}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;
      })}
      <div className="floating-button">
        <Button variant="contained" onClick={goToSelectedCoursesPage}>
          View Selected Courses
        </Button>
      </div>
    </div>
  );
};

const intersectArrays = (array1, array2) => {
  return array1.some((element) => array2.includes(element));
};

export default CourseList;

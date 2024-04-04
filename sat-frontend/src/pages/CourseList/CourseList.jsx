import ForwardRoundedIcon from "@mui/icons-material/ForwardRounded";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CourseCard from "../../components/CourseCard";
import "./CourseListStyle.css";
import { Button } from "@material-ui/core";

const CourseList = () => {
  // const course_types = [
  //   "upper_division",
  //   "lower_division",
  //   "general_education",
  //   "senior_design",
  //   "technical_elective",
  // ];

  const types = {
    upper_division: "Upper Division",
    lower_division: "Lower Division",
    general_education: "General Education",
    senior_design: "Senior Design",
    technical_elective: " Technical Elective",
  };

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
  const navigate = useNavigate();
  const location = useLocation();
  const { program, college, term } = location.state;

  console.log("Location", program, college, term);
  const startYear = location.state.startyear;
  useEffect(() => {
    if (location.state) {
      console.log("CourseListYear:", startYear);
    } else {
      console.log("Location state is not available.");
    }
  }, [location.state]);
  const [matchedCourses, setMatchedCourses] = useState([]);
  const [csulaCourseList, setCsulaCourseList] = useState([]);
  const [remainingCsulaCourses, setRemainingCsulaCourses] = useState([]);
  const [checkboxResponses, setCheckboxResponses] = useState({});
  const [course_types, setCourseTypes] = useState([]);

  useEffect(() => {
    if (program && college) {
      const fetchCourses = async () => {
        try {
          const csulaResponse = await axios.get(
            `http://localhost:3001/fetch-all-csula-courses?dept=${program.department}`
          );
          console.log("csulaResponse", csulaResponse.data);
          let filteredCourses = csulaResponse.data.filter(
            (course) => course.block_type
          );
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
            filteredCourses,
            selectedSchoolResponse.data
          );
          setMatchedCourses(matched);
          setRemainingCsulaCourses(remainingCsula);

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
    console.log("courseId", courseId, isChecked);
    setCheckboxResponses({ ...checkboxResponses, [courseId]: isChecked });
  };

  const goToSelectedCoursesPage = () => {
    const selectedCoursesWithFlag = csulaCourseList.map((course) => ({
      ...course,
      completed: checkboxResponses[course._id] ? true : false,
    }));
    navigate("/course-selection", {
      state: {
        program: program,
        term: term.value,
        courseList: selectedCoursesWithFlag,
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
      {course_types.map((course_type) => (
        <div key={course_type}>
          <div className="course_type">
            <h2>{types[course_type]}</h2>
          </div>
          <div className="course-group">
            {matchedCourses
              .filter(
                ({ csulaCourse }) => csulaCourse.course_type === course_type
              )
              .map(({ csulaCourse, selectedCourse }) => (
                <div className="course-row" key={csulaCourse._id}>
                  {csulaCourse.course_type === "general_education" ? (
                    blocks
                      .filter((block) => csulaCourse.block_type === block)
                      .map((block) => (
                        <>
                          <div style={{ width: "100%" }}>
                            <h2 className="blockTitle">{block_types[block]}</h2>

                            <div className="course-row">
                              <div className="college-column">
                                {!selectedSchoolHeadingRendered && (
                                  <h2>Selected School Courses</h2>
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
                                  <ForwardRoundedIcon
                                    style={{ fontSize: 40 }}
                                  />
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
                        </>
                      ))
                  ) : (
                    <>
                      <div className="college-column">
                        {!selectedSchoolHeadingRendered && (
                          <h2>Selected School Courses</h2>
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
                      </div>
                      <div className="arrow-column">
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            height: "100%",
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
                    </>
                  )}
                  {(selectedSchoolHeadingRendered = true)}
                </div>
              ))}
          </div>
        </div>
      ))}
      <button onClick={goToSelectedCoursesPage}>View Selected Courses</button>
    </div>
  );
};

const intersectArrays = (array1, array2) => {
  return array1.some((element) => array2.includes(element));
};

export default CourseList;

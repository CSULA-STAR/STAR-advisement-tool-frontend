import { useLocation } from "react-router-dom";
import CourseCard from "../../components/CourseCard";
import { useState, useEffect } from "react";
import "./style.css";
import IconButton from "@mui/material/IconButton";
import PrintIcon from "@mui/icons-material/Print";
import { extractCourseNumbers } from "../../utils";
const SelectedCoursesPage = () => {
  const location = useLocation();
  const { courseList, startYear } = location.state || {};
  const [SelectedCourses, setSelectedCourses] = useState([]);

  // const selectedCoursesWithFlag = selectedCourses.map((course) => ({
  //   ...course,
  //   completed: true,
  // }));

  // const filteredOutCoursesWithFlag = filteredOutCourses.map((course) => ({
  //   ...course,
  //   completed: false,
  // }));

  // const courseList = selectedCoursesWithFlag.concat(filteredOutCoursesWithFlag);

  useEffect(() => {
    setSelectedCourses(JSON.parse(localStorage.getItem("selectedCourses")));
  }, []);

  const firstYearCourses = SelectedCourses.filter(
    (course) => Math.min(...extractCourseNumbers(course.subject_code)) < 2000
  );

  const secondYearCourses = SelectedCourses.filter((course) => {
    const minCourseNumber = Math.min(
      ...extractCourseNumbers(course.subject_code)
    );
    const maxCourseNumber = Math.max(
      ...extractCourseNumbers(course.subject_code)
    );
    return minCourseNumber >= 2000 && maxCourseNumber < 3000;
  });

  const thirdYearCourses = SelectedCourses.filter(
    (course) => Math.min(...extractCourseNumbers(course.subject_code)) >= 3000
  );
  const handleCommentClick = (course) => {
    console.log("Adding comment for course:", course);
  };

  const handlePrintScreen = () => {
    window.print();
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "end",
          marginBottom: "10px",
        }}
      >
        <IconButton onClick={handlePrintScreen}>
          <PrintIcon />
        </IconButton>
      </div>
      <div className="container">
        {/* First Year Courses */}
        <div className="row">
          <h2>First Year</h2>
          {firstYearCourses.map((course) => (
            <div key={course._id} className="cardContainer">
              <CourseCard
                course={course}
                enableCheckbox={false}
                onCommentClick={handleCommentClick}
                addCommment={true}
              />
            </div>
          ))}
        </div>

        {/* Second Year Courses */}
        <div className="row">
          <h2>Second Year</h2>
          {secondYearCourses.map((course) => (
            <div key={course._id} className="cardContainer">
              <CourseCard
                course={course}
                enableCheckbox={false}
                onCommentClick={handleCommentClick}
                addCommment={true}
              />
            </div>
          ))}
        </div>

        {/* Third Year Courses */}
        <div className="row">
          <h2>Third Year</h2>
          {thirdYearCourses.map((course) => (
            <div key={course._id} className="cardContainer">
              <CourseCard
                course={course}
                enableCheckbox={false}
                onCommentClick={handleCommentClick}
                addCommment={true}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SelectedCoursesPage;

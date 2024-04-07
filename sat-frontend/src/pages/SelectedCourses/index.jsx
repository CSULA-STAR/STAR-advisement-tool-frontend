import { useLocation } from "react-router-dom";
import CourseCard from "../../components/CourseCard";
import { useState, useEffect } from "react";
import "./style.css";
import IconButton from "@mui/material/IconButton";
import PrintIcon from "@mui/icons-material/Print";
import { extractCourseNumbers } from "../../utils";
import { Typography } from "@mui/material";

const SelectedCoursesPage = () => {
  const location = useLocation();
  const { courseList, startYear } = location.state || {};
  const [SelectedCourses, setSelectedCourses] = useState([]);

  useEffect(() => {
    setSelectedCourses(JSON.parse(localStorage.getItem("selectedCourses")));
  }, []);

  const coursesByYearAndTerm = (yearOffset, term) => {
    return SelectedCourses.filter((course) => {
      return (
        course.selected_term?.toLowerCase() === term.toLowerCase() &&
        course.startYear === startYear + yearOffset
      );
    });
  };

  const handleCommentClick = (course) => {
    console.log("Adding comment for course:", course);
  };

  const handlePrintScreen = () => {
    window.print();
  };

  return (
    <>
      <div className="printTable" style={{ display: "none" }}>
        <table>
          <thead>
            <tr>
              <th>Year</th>
              <th>Spring</th>
              <th>Summer</th>
              <th>Fall</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{startYear - 1}</td>
              <td>
                {coursesByYearAndTerm(-1, "Spring").map((course, index) => (
                  <div key={index} className="courseDetails">
                    <h5>{course.course_code}</h5>
                    {course.course_name} <br />
                    Pre-requisite :{" "}
                    {course.pre_requisite?.course_code
                      .map((id) => id)
                      .join(", ")}
                  </div>
                ))}
              </td>
              <td>
                {coursesByYearAndTerm(-1, "Summer").map((course, index) => (
                  <div key={index} className="courseDetails">
                    <h5>{course.course_code}</h5>
                    {course.course_name} <br />
                    Pre-requisite :{" "}
                    {course.pre_requisite?.course_code
                      .map((id) => id)
                      .join(", ")}
                  </div>
                ))}
              </td>
              <td>
                {coursesByYearAndTerm(-1, "Fall").map((course, index) => (
                  <div key={index} className="courseDetails">
                    <h5>{course.course_code}</h5>
                    {course.course_name} <br />
                    Pre-requisite :{" "}
                    {course.pre_requisite?.course_code
                      .map((id) => id)
                      .join(", ")}
                  </div>
                ))}
              </td>
            </tr>
            <tr>
              <td>{startYear}</td>
              <td>
                {coursesByYearAndTerm(0, "Spring").map((course, index) => (
                  <div key={index} className="courseDetails">
                    <h5>{course.course_code}</h5>
                    {course.course_name} <br />
                    Pre-requisite :{" "}
                    {course.pre_requisite?.course_code
                      .map((id) => id)
                      .join(", ")}
                  </div>
                ))}
              </td>
              <td>
                {coursesByYearAndTerm(0, "Summer").map((course, index) => (
                  <div key={index} className="courseDetails">
                    <h5>{course.course_code}</h5>
                    {course.course_name} <br />
                    Pre-requisite :{" "}
                    {course.pre_requisite?.course_code
                      .map((id) => id)
                      .join(", ")}
                  </div>
                ))}
              </td>
              <td>
                {coursesByYearAndTerm(0, "Fall").map((course, index) => (
                  <div key={index} className="courseDetails">
                    <h5>{course.course_code}</h5>
                    {course.course_name} <br />
                    Pre-requisite :{" "}
                    {course.pre_requisite?.course_code
                      .map((id) => id)
                      .join(", ")}
                  </div>
                ))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

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
        <div className="yearsContainer">
          {/* First Year Column */}
          <div className="yearColumn">
            <Typography variant="h4">First Year ({startYear - 1})</Typography>
            {["Spring", "Summer", "Fall"].map((term) => (
              <div key={term} className="termSection">
                <h3>{term}</h3>
                {coursesByYearAndTerm(-1, term).map((course) => (
                  <div key={course._id} className="cardContainer">
                    <CourseCard
                      course={course}
                      enableCheckbox={false}
                      onCommentClick={handleCommentClick}
                      addComment={true}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Second Year Column */}
          <div className="yearColumn">
            <Typography variant="h4">Second Year ({startYear})</Typography>
            {["Spring", "Summer", "Fall"].map((term) => (
              <div key={term} className="termSection">
                <h3>{term}</h3>
                {coursesByYearAndTerm(0, term).map((course) => (
                  <div key={course._id} className="cardContainer">
                    <CourseCard
                      course={course}
                      enableCheckbox={false}
                      onCommentClick={handleCommentClick}
                      addComment={true}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SelectedCoursesPage;

import { useLocation } from "react-router-dom";
import CourseCard from "../../components/CourseCard";
import { useState, useEffect } from "react";
import "./style.css";
import IconButton from "@mui/material/IconButton";
import PrintIcon from "@mui/icons-material/Print";
import { Typography } from "@mui/material";
import { toSentenceCase } from "../../utils";

const SelectedCoursesPage = () => {
  const location = useLocation();
  const { courseList } = location.state || {};
  const [selectedCourses, setSelectedCourses] = useState([]);

  useEffect(() => {
    setSelectedCourses(JSON.parse(localStorage.getItem("selectedCourses")));
  }, []);

  const handleCommentClick = (course) => {
    console.log("Adding comment for course:", course);
  };

  const handlePrintScreen = () => {
    window.print();
  };
  const coursesByTermAndYear = () => {
    const courses = {};
    selectedCourses.forEach((course) => {
      const { term, year } = course.selected_term;
      if (!courses[year]) {
        courses[year] = {};
      }
      if (!courses[year][term]) {
        courses[year][term] = [];
      }
      courses[year][term].push(course);
    });
    return courses;
  };

  const renderCourseDetails = (courses) => {
    const rows = [];
    Object.keys(courses).forEach((year) => {
      rows.push(
        <tr key={year}>
          <td>{year}</td>
          <td>
            {courses[year]["spring"] && renderCourses(courses[year]["spring"])}
          </td>
          <td>
            {courses[year]["summer"] && renderCourses(courses[year]["summer"])}
          </td>
          <td>
            {courses[year]["fall"] && renderCourses(courses[year]["fall"])}
          </td>
        </tr>
      );
    });
    return rows;
  };

  const renderCourses = (courses) => {
    return courses.map((course) => (
      <div key={course._id}>
        <p>{course.course_name}</p>
        <p>Credits: {course.credits}</p>
        <p>Pre-requisite: {course.pre_requisite.description}</p>
      </div>
    ));
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
          <tbody>{renderCourseDetails(coursesByTermAndYear())}</tbody>
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
          {selectedCourses
            .reduce((years, course) => {
              const { year, term } = course.selected_term;
              const existingYear = years.find((item) => item.year === year);

              if (!existingYear) {
                years.push({ year, terms: [term] });
              } else if (!existingYear.terms.includes(term)) {
                existingYear.terms.push(term);
              }

              return years;
            }, [])
            .map((yearObj) => (
              <div key={yearObj.year} className="yearColumn">
                <Typography variant="h4">{`Year ${yearObj.year}`}</Typography>
                <div className="termSection">
                  {yearObj.terms.map((term) => (
                    <div key={`${yearObj.year}-${term}`} className="termRow">
                      <h3>{toSentenceCase(term)}</h3>
                      {selectedCourses
                        .filter(
                          (course) =>
                            course.selected_term.year === yearObj.year &&
                            course.selected_term.term === term
                        )
                        .map((course) => (
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
            ))}
        </div>
      </div>
    </>
  );
};

export default SelectedCoursesPage;

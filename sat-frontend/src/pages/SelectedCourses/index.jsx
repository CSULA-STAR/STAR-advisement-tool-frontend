import { useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import CourseCard from "../../components/CourseCard";
import "./style.css";

const useStyles = makeStyles(() => ({
  selectedCourse: {
    backgroundColor: "#f0f0f0", // Grey color
    padding: "8px",
    marginBottom: "8px",
    borderRadius: "4px",
  },
}));

const SelectedCoursesPage = () => {
  const classes = useStyles();
  const location = useLocation();
  const { selectedCourses, filteredOutCourses } = location.state || {};
  console.log("selectedCourses", selectedCourses);
  console.log("filteredOutCourses", filteredOutCourses);

  return (
    <div className="container">
      <h1>Completed Courses</h1>
      {selectedCourses && selectedCourses.length > 0 ? (
        selectedCourses.map((course) => (
          <div key={course._id} className={classes.selectedCourse}>
            <CourseCard course={course} enableCheckbox={false} />
          </div>
        ))
      ) : (
        <p>No courses selected.</p>
      )}

      {/* <h2>Remaining Courses:</h2> */}
      {filteredOutCourses && filteredOutCourses.length > 0 ? (
        filteredOutCourses.map((course) => (
          <div key={course._id}>
            <CourseCard course={course} enableCheckbox={false} />
          </div>
        ))
      ) : (
        <p>No courses filtered out.</p>
      )}
    </div>
  );
};

export default SelectedCoursesPage;

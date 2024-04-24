import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toSentenceCase } from "../../utils";

const SelectedCoursesPage = () => {
  const Courses = useSelector((state) => state);
  const [selectedCourses, setSelectedCourses] = useState([]);

  useEffect(() => {
    setSelectedCourses(Courses);
  }, [Courses]);

  const coursesByTermAndYear = () => {
    const courses = {};
    selectedCourses.forEach((course) => {
      if (course?.selected_term) {
        const { term, year } = course.selected_term;
        if (!courses[year]) {
          courses[year] = {};
        }
        if (!courses[year][term]) {
          courses[year][term] = [];
        }
        courses[year][term].push(course);
      }
    });
    return courses;
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
        <IconButton onClick={() => window.print()}>
          <PrintIcon />
        </IconButton>
      </div>

      <div className="container">
        {Object.entries(coursesByTermAndYear()).map(([year, terms]) => (
          <div key={year}>
            {Object.entries(terms).map(([term, courses]) => (
              <div key={`${year}-${term}`}>
                <Typography variant="h5">{`${toSentenceCase(
                  term
                )} ${year}`}</Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Course Name</TableCell>
                        <TableCell>Credits</TableCell>
                        <TableCell>Pre-requisite</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {courses.map((course) => (
                        <TableRow key={course._id}>
                          <TableCell>{course.course_name}</TableCell>
                          <TableCell>{course.credits}</TableCell>
                          <TableCell>
                            {course.pre_requisite.description}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default SelectedCoursesPage;

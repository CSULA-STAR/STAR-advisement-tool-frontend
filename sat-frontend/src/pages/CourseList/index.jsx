import { useState, useEffect } from "react";
import axios from "axios";
import CourseCard from "../../components/CourseCard";
import { useLocation, useNavigate } from "react-router-dom";
import "./style.css";

const CourseList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { program, sId } = location.state || {};
  console.log("location", location.state);
  const [matchedCourses, setMatchedCourses] = useState([]);
  const [csulaCourseList, setCsulaCourseList] = useState([]);
  const [remainingCsulaCourses, setRemainingCsulaCourses] = useState([]);
  const [checkboxResponses, setCheckboxResponses] = useState({});

  useEffect(() => {
    if (program && sId) {
      const fetchCourses = async () => {
        try {
          const csulaResponse = await axios.get(
            `http://localhost:3001/fetch-csula-courses?dept=${program.department}`
          );
          console.log("-->21", csulaResponse.data);
          setCsulaCourseList(csulaResponse.data);
          const selectedSchoolResponse = await axios.get(
            `http://localhost:3001/fetch-courses?sid=${sId}`
          );
          console.log("-->27", selectedSchoolResponse.data);

          const { matched, remainingCsula } = findMatchingCourses(
            csulaResponse.data,
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
  }, [program, sId]);

  const findMatchingCourses = (csulaCourses, selectedSchoolCourses) => {
    const matched = [];
    const remainingCsula = [];
    csulaCourses.forEach((csulaCourse) => {
      const match = selectedSchoolCourses.find((selectedCourse) =>
        intersectArrays(csulaCourse.subject_code, selectedCourse.equivalent_to)
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
    const selectedCourses = [];
    const filteredOutCourses = [];

    csulaCourseList.forEach((course) => {
      if (checkboxResponses[course._id]) {
        selectedCourses.push(course);
      } else {
        filteredOutCourses.push(course);
      }
    });

    navigate("/selected-courses", {
      state: { selectedCourses, filteredOutCourses },
    });
  };

  if (!program || !sId) {
    return <div>Error: Missing program or sId props</div>;
  }

  console.log("matchedCourses", matchedCourses);
  console.log("remainingCsulaCourses", remainingCsulaCourses);

  let selectedSchoolHeadingRendered = false;
  let csulaHeadingRendered = false;

  return (
    <div className="course-list-container">
      {matchedCourses.map(({ csulaCourse, selectedCourse }) => (
        <div className="course-row" key={csulaCourse._id}>
          <div className="college-column">
            {!selectedSchoolHeadingRendered && <h2>Selected School Courses</h2>}
            <CourseCard
              enableCheckbox={false}
              course={selectedCourse}
              onCheckboxChange={handleCheckboxChange}
              isChecked={checkboxResponses[csulaCourse._id]}
            />
            {(selectedSchoolHeadingRendered = true)}
          </div>
          <div className="college-column">
            {!csulaHeadingRendered && <h2>Cal State LA Courses</h2>}
            <CourseCard
              enableCheckbox={true}
              course={csulaCourse}
              onCheckboxChange={handleCheckboxChange}
              isChecked={checkboxResponses[csulaCourse._id]}
            />
            {(csulaHeadingRendered = true)}
          </div>
        </div>
      ))}
      {remainingCsulaCourses.map((course) => (
        <div className="course-row" key={course.id}>
          <div className="college-column"></div>
          <div className="college-column">
            <CourseCard
              key={course.id}
              course={course}
              onCheckboxChange={handleCheckboxChange}
              isChecked={checkboxResponses[course.id]}
            />
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

import { Box, Button, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { addCourse } from "../../slices/selectedCourseSlice";
import {
  abbreviateTerm,
  getNextTerm,
  getTermLabel,
  toSentenceCase,
} from "../../utils";
import "./courseSelectionStyle.css";

import CustomTable from "./CustomTable";
import SideTable from "./SideTable";

const columns = [
  {
    accessorKey: "course_code",
    header: "Course",
  },
  {
    accessorKey: "course_name",
    header: "Name",
  },
  {
    accessorKey: "credits",
    header: "Units",
  },
  {
    accessorKey: "term",
    header: "Offered in",
    Cell: ({ cell }) => (
      <Stack
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "start",
        }}
      >
        {cell.getValue().map((str, index) => (
          <Box
            key={index}
            sx={{
              border: "1px solid black",
              padding: "3px",
              marginRight: "5px",
            }}
          >
            {abbreviateTerm(str)}
          </Box>
        ))}
      </Stack>
    ),
  },
];

const CourseSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const exCourses = useSelector((state) => state);
  const dispatch = useDispatch();
  const [termData, setTermData] = useState([]);
  const [courseListData, setCourseListData] = useState(
    location.state.courseList
  );
  const [navigationCount, setNavigationCount] = useState(0);
  const { startTerm, startYear, program } = location.state || {};
  const [geCourses, setGECourses] = useState([]);
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [deptBlock, setDeptBlock] = useState([]);
  const [currentTerm, setCurrentTerm] = useState(startTerm.value);
  const [currentYear, setCurrentYear] = useState(startYear);
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [geRowSelection, setGeRowSelection] = useState({});
  const [currTableData, setCurrTableData] = useState([]);
  const [nonGECourses, setNonGECourses] = useState([]);
 

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const deptBlockResponse = await axios.get(
          `http://localhost:3001/fetch-req-block-details?dept=${program.department}`
        );
        setDeptBlock(deptBlockResponse.data.blocks);
        console.log("dept Block ," , deptBlock);
        console.log("Ex courses : " , exCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const dataSeperation = () => {
    const termCourseList = courseListData.filter((course) =>
      course.term.includes(toSentenceCase(currentTerm))
    );

    const ge_courses = termCourseList.filter(
      (course) => course.course_type === "general_education"
    );
    const non_ge_courses = termCourseList.filter(
      (course) =>
        course.course_type !== "general_education" &&
        (course.pre_requisite.course_code.length === 0 ||
          course.pre_requisite.course_code.some((code) =>
            exCourses.some((selectedCourse) =>
              selectedCourse.course_code.includes(code)
            )
          ))
    );
    console.log("termD--1", non_ge_courses.length);

    setNonGECourses(non_ge_courses);
    setGECourses(ge_courses);

    setTermData(termCourseList);
  };

  useEffect(() => {
    dataSeperation();
  }, [currentTerm]);

  const handlePreviousClick = () => {};
  const handleFinishClick = () => {
    navigate("/selected-courses", {
      state: {
        courseList: exCourses,
        startTerm,
        startYear,
        endTerm: currentTerm,
        endYear: currentYear,
      },
    });
  };

  const handleNextClick = async () => {
    setCurrentTerm(getNextTerm(currentTerm));
    setCurrentYear(currentTerm === "fall" ? currentYear + 1 : currentYear);

    const mergedSelection = { ...rowSelection, ...geRowSelection };
    const selectedCourseIds = Object.keys(mergedSelection);
    console.log("selectedCourseIds", selectedCourseIds);


    const checkedCourses = courseListData.filter((course) =>
      selectedCourseIds.includes(course._id)
    );

    const uncheckedCourses = courseListData.filter(
      (course) => !selectedCourseIds.includes(course._id)
    );

    const updatedCheckedCourses = checkedCourses.map((course) => ({
      ...course,
      selected_term: { term: currentTerm, year: currentYear },
      startYear: startYear,
    }));
    console.log(
      "courseListData",
      courseListData.length,
      uncheckedCourses.length
    );
    dispatch(addCourse(updatedCheckedCourses));

    setRowSelection({});
    setGeRowSelection({});

    if (navigationCount < 5 && location.pathname !== "/selected-courses") {
      setNavigationCount(navigationCount + 1);
      setCourseListData(uncheckedCourses);
      setIsTableVisible(false);
    } else if (navigationCount >= 5) {
      navigate("/selected-courses", {
        state: {
          courseList: uncheckedCourses,
          startTerm,
          startYear,
          endTerm: currentTerm,
          endYear: currentYear,
        },
      });
    }
  };

  const getSelectedBlockIds = () => {
    const selectedBlockIds = exCourses
      .filter(course => course.course_type === "general_education")
      .map(course => course.block_type);
  
    return selectedBlockIds;
  };

  const handleShowAllCourses = (res) => {
    setShowAllCourses(res);
    console.log("termD--2", res);
    if (res) {
      const non_ge_courses = termData.filter(
        (course) => course.course_type !== "general_education"
      );
      setCourseListData(non_ge_courses);
      setNonGECourses(non_ge_courses);
    } else {
      dataSeperation();
    }
  };

  const handleRowSelectionChange = (e) => {
    setRowSelection(e);
  };

  const handleBlockClick = (block) => {
    setIsTableVisible(true);
    setCurrTableData({
      title: block.name,
      courses: geCourses.filter(
        (course) => course.block_type == block.block_id
      ),
    });
  };

  const renderBlocks = () => (
    <Stack direction="row" spacing={2}>
      {deptBlock.map((block, index) => (
        <Box
          key={index}
          sx={{
            border: "1px solid grey",
            p: 2,
            bgcolor: "background.paper",
            boxShadow: 1,
            borderRadius: 1,
            cursor: "pointer",
            bgcolor: getSelectedBlockIds().includes(block.block_id) ? "green" : "background.paper",
            color: getSelectedBlockIds().includes(block.block_id) ? "white" : "black",
          }}
          onClick={() => handleBlockClick(block)}
        >
          <Typography
            sx={{ fontWeight: "bold" }}
            variant="subtitle2"
            component="div"
          >
            GE
          </Typography>
          <Typography variant="body" component="div">
            {block.name}
          </Typography>
        </Box>
      ))}
    </Stack>
  );

  return (
    <Box sx={{ textAlign: "center" }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        padding={3}
      >
        <Box>
          <Typography variant="h4" component="div">
            {getTermLabel(currentTerm)} {currentYear}
          </Typography>
        </Box>
        <Box>
          <Button
            variant="contained"
            sx={{ marginRight: "10px" }}
            onClick={handlePreviousClick}
          >
            Previous
          </Button>
          <Button
            variant="contained"
            sx={{ marginRight: "10px" }}
            onClick={handleNextClick}
          >
            Next
          </Button>
          <Button variant="contained" onClick={handleFinishClick}>
            Finish
          </Button>
        </Box>
      </Stack>

      <Stack sx={{ m: "2rem 2rem", display: "flex", flexDirection: "row" }}>
        <Stack sx={{ flex: "1" }}>
          <SideTable data={exCourses} />
        </Stack>
        <Stack sx={{ flex: "0.5" }}></Stack>
        <Stack sx={{ flex: "5" }}>
          <Box sx={{ pb: "1rem" }}>
            <CustomTable
              data={nonGECourses}
              columns={columns}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              filters={true}
              showAllCourses={showAllCourses}
              handleShowAllCourses={handleShowAllCourses}
              handleRowSelectionChange={handleRowSelectionChange}
            />
          </Box>
          <Stack sx={{ mt: "2rem" }}>
            {renderBlocks()}
            <Box sx={{ mt: "2rem" }}>
              {isTableVisible ? (
                <>
                  <Typography variant="h5">{currTableData.title}</Typography>
                  <CustomTable
                    data={currTableData.courses}
                    columns={columns}
                    rowSelection={geRowSelection}
                    setRowSelection={setGeRowSelection}
                  />
                </>
              ) : null}
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default CourseSelection;

import {
  Box,
  Button,
  Stack,
  Typography,
  TextField,
  Tooltip,
} from "@mui/material";
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
    Cell: ({ cell, row }) => (
      <Stack>
        {cell.getValue()}
        {row.original?.isNewlyAdded ? "(Not Eligible)" : null}
      </Stack>
    ),
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
  {
    accessorKey: "pre_requisite.course_code",
    header: "Requisites",
    Cell: ({ row }) => {
      console.log("PRE", row.original.pre_requisite);
      return (
        <>
          {row.original.pre_requisite.course_code.length ? (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                fontWeight="bold"
                variant="body2"
                sx={{ marginRight: "5px" }}
              >
                PRE:{" "}
              </Typography>
              {row.original.pre_requisite.course_code.map((code, index) => (
                <Tooltip key={index} title={code}>
                  <Typography variant="body2">
                    {index > 0 && index < 2 ? ", " : ""}
                    {index < 2 ? code : "."}
                  </Typography>
                </Tooltip>
              ))}
            </Box>
          ) : null}
          {row.original.co_requisite.course_code.length ? (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                fontWeight="bold"
                variant="body2"
                sx={{ marginRight: "5px" }}
              >
                CO:
              </Typography>
              {row.original.co_requisite.course_code.map((code, index) => (
                <Typography variant="body2" key={index}>
                  {index > 0 ? ", " : ""}
                  {code}
                </Typography>
              ))}
            </Box>
          ) : null}
        </>
      );
    },
  },
  {
    accessorKey: "comments",
    header: "Comments",
    Cell: ({ row }) => (
      <Stack
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "start",
        }}
      >
        <TextField
          disabled={!row.original?.isNewlyAdded}
          id="outlined-basic"
          label=" Comments"
          variant="outlined"
          size="small"
          onChange={(event) => {
            row.original.comment = event.target.value;
          }}
        />
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

  const [navigationHistory, setNavigationHistory] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const deptBlockResponse = await axios.get(
          `http://localhost:3001/fetch-req-block-details?dept=${program.department}`
        );
        setDeptBlock(deptBlockResponse.data.blocks);
        console.log("dept Block ,", deptBlock);
        console.log("Ex courses : ", exCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const dataSeperation = () => {
    const termCourseList = courseListData
      .filter((course) => course.term.includes(toSentenceCase(currentTerm)))
      .filter(
        (course) => !exCourses.some((exCourse) => exCourse._id === course._id)
      );
    console.log("DATAAAA", courseListData, termCourseList);
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

  const handlePreviousClick = () => {
    // Check if there is a previous state in the navigation history
    console.log("navigationHistory.length", navigationHistory.length);
    if (navigationHistory.length > 0) {
      // Pop the last state from the history
      const prevState = navigationHistory.pop();
      setCurrentTerm(prevState.term);
      setCurrentYear(prevState.year);
      // Navigate back with the previous state
      navigate("/course-selection", {
        state: {
          ...location.state,
          startTerm: prevState.term,
          startYear: prevState.year,
        },
      });
      setNavigationCount(navigationCount - 1);
    } else {
      window.alert("No previous terms available");
    }
  };
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
    setShowAllCourses(false);
    setNavigationHistory([
      ...navigationHistory,
      { term: currentTerm, year: currentYear },
    ]);
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
      checked: true,
      selected_term: { term: currentTerm, year: currentYear },
      startYear: startYear,
    }));
    // const combinedCourseList = [...updatedCheckedCourses, ...uncheckedCourses];

    console.log("courseListData", courseListData, uncheckedCourses);
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
      .filter((course) => course.course_type === "general_education")
      .map((course) => course.block_type);

    return selectedBlockIds;
  };

  // const handleShowAllCourses = (res) => {
  //   setShowAllCourses(res);
  //   console.log("termD--2", res);
  //   if (res) {
  //     const non_ge_courses = termData.filter(
  //       (course) => course.course_type !== "general_education"
  //     );
  //     setNonGECourses(non_ge_courses);
  //   } else {
  //     dataSeperation();
  //   }
  // };

  const handleShowAllCourses = (res) => {
    setShowAllCourses(res);
    if (res) {
      const remainingCourses = termData.filter(
        (course) =>
          course.course_type !== "general_education" &&
          !nonGECourses.some(
            (existingCourse) => existingCourse._id === course._id
          )
      );
      // setCourseListData(non_ge_courses);
      setNonGECourses([
        ...nonGECourses,
        ...remainingCourses.map((course) => ({
          ...course,
          isNewlyAdded: true,
        })),
      ]);
    } else {
      dataSeperation();
    }
  };

  const handleRowSelectionChange = (e) => {
    setRowSelection(e);
  };

  // const handleBlockClick = (block) => {
  //   setIsTableVisible(true);
  //   setCurrTableData({
  //     title: block.name,
  //     courses: geCourses.filter(
  //       (course) => course.block_type == block.block_id
  //     ),
  //   });
  // };

  const handleBlockClick = (block) => {
    // Open a new tab with the block route
    openNewTabWithBlockRoute(`/${block.block_id}`);
  };

  const openNewTabWithBlockRoute = (blockRoute) => {
    const newTab = window.open(blockRoute, "_blank");
    if (!newTab) {
      // Handle the case where the new tab could not be opened
      console.error("Unable to open new tab");
    }
  };

  const renderBlocks = () => (
    <Stack direction="row" spacing={2}>
      {deptBlock.map((block, index) => (
        <Box
          key={index}
          sx={{
            border: "1px solid grey",
            p: 2,
            boxShadow: 1,
            borderRadius: 1,
            cursor: "pointer",
            bgcolor: getSelectedBlockIds().includes(block.block_id)
              ? "green"
              : "background.paper",
            color: getSelectedBlockIds().includes(block.block_id)
              ? "white"
              : "black",
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
        <Stack sx={{ flex: "1" }} spacing={2}>
          <SideTable data={exCourses} />
          <SideTable data={exCourses} type="normal" />
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
              currentTerm={currentTerm}
              currentYear={currentYear}
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
                    currentTerm={currentTerm}
                    currentYear={currentYear}
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

import { Box, Button, Stack, Typography } from "@mui/material";
import axios from "axios";
import {
  MRT_GlobalFilterTextField,
  MRT_ToolbarAlertBanner,
  useMaterialReactTable,
} from "material-react-table";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { addCourse } from "../../slices/selectedCourseSlice";
import {
  getNextTerm,
  getTermLabel,
  toSentenceCase,
  abbreviateTerm,
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
    Cell: ({ cell }) => {
      return (
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
      );
    },
  },
];

const CourseSelection = () => {
  const courseTypes = [
    "upper_division",
    "lower_division",
    "general_education",
    "senior_design",
    "technical_elective",
  ];

  const types = {
    upper_division: "Upper Division",
    lower_division: "Lower Division",
    general_education: "General Education",
    senior_design: "Senior Design",
    technical_elective: "Technical Elective",
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

  const location = useLocation();
  const [termData, setTermData] = useState([]);
  const [courseListData, setCourseListData] = useState([]);
  // const [checkboxResponses, setCheckboxResponses] = useState({});
  const navigate = useNavigate();
  const exCourses = useSelector((state) => state);
  const dispatch = useDispatch();
  const [navigationCount, setNavigationCount] = useState(0);
  const { courseList, startTerm, startYear, program } = location.state || {};
  const [geCourses, setGeCourses] = useState([]);
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [deptBlock, setDeptBlock] = useState([]);
  const [currentTerm, setCurrentTerm] = useState(startTerm.value);
  const [currentYear, setCurrentYear] = useState(startYear);
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [geRowSelection, setGeRowSelection] = useState({});
  const [currTableData, setCurrTableData] = useState([]);

  const sideTableColumns = [
    {
      accessorKey: "term",
      header: { currentTerm },
    },
  ];
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const deptBlockResponse = await axios.get(
          `http://localhost:3001/fetch-req-block-details?dept=${program.department}`
        );
        setDeptBlock(deptBlockResponse.data.blocks);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const termCourseList = courseList.filter((course) =>
      course.term.includes(toSentenceCase(currentTerm))
    );

    const ge_courses = termCourseList.filter(
      (course) => course.course_type === "general_education"
    );

    const non_ge_courses_test = termCourseList.filter(
      (course) => course.course_type !== "general_education"
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
    console.log("non_ge_courses", non_ge_courses, non_ge_courses_test);
    setCourseListData(non_ge_courses);
    setGeCourses(ge_courses);

    setTermData(termCourseList);
  }, [courseList, currentTerm]);

  // const handleCheckboxChange = (courseId, isChecked) => {
  //   setCheckboxResponses({ ...checkboxResponses, [courseId]: isChecked });
  // };

  const handlePreviousClick = () => {};
  const handleFinishClick = () => {};

  const handleNextClick = async () => {
    setCurrentTerm(getNextTerm(currentTerm));
    setCurrentYear(currentTerm === "fall" ? currentYear + 1 : currentYear);

    const checkedCourseIds = Object.keys(rowSelection).filter(
      (courseId) => rowSelection[courseId]
    );
    console.log("checkedCourseIds", checkedCourseIds);

    const checkedCourses = termData.filter((course, index) =>
      checkedCourseIds.includes(index.toString())
    );
    console.log("checkedCourses", checkedCourses);

    const uncheckedCourses = termData.filter(
      (course, index) => !checkedCourseIds.includes(index.toString())
    );

    const updatedCheckedCourses = checkedCourses.map((course) => ({
      ...course,
      selected_term: { term: currentTerm, year: currentYear },
      startYear: startYear,
    }));

    dispatch(addCourse(updatedCheckedCourses));

    setTermData(uncheckedCourses);

    // Reset the rowSelection state
    setRowSelection({});

    if (navigationCount < 5 && location.pathname !== "/selected-courses") {
      setNavigationCount(navigationCount + 1);
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

  const handleShowAllCourses = (res) => {
    console.log("res", res);
    setShowAllCourses(res);
    if (res === true) {
      const non_ge_courses = courseListData.filter(
        (course) => course.course_type !== "general_education"
      );
      setCourseListData(non_ge_courses);
    }
  };

  // const handleRowSelectionChange = (selectedIndex, isChecked) => {
  //   const courseId = termData[selectedIndex]._id;
  //   setRowSelection((prevSelection) => ({
  //     ...prevSelection,
  //     [courseId]: isChecked,
  //   }));
  // };
  console.log("filterdones", courseListData);
  const table = useMaterialReactTable({
    columns,
    data: courseListData,
    enableRowSelection: true,
    getRowId: (row) => row._Id,
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
    initialState: {
      pagination: { pageSize: 5, pageIndex: 0 },
      showGlobalFilter: true,
    },
    muiPaginationProps: {
      rowsPerPageOptions: [5, 10, 15],
      variant: "outlined",
    },
    paginationDisplayMode: "pages",
  });

  const handleBlockClick = (block) => {
    setIsTableVisible(true);

    setCurrTableData({
      title: block.name,
      courses: geCourses.filter(
        (course) => course.block_type == block.block_id
      ),
    });
  };

  const renderBlocks = () => {
    console.log("renderingnn");
    return (
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
  };

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

      {/* *************TEST********************** */}

      <Stack sx={{ m: "2rem 2rem", display: "flex", flexDirection: "row" }}>
        <Stack sx={{ flex: "1" }}>
          <SideTable data={exCourses} />
        </Stack>
        <Stack sx={{ flex: "0.5" }}></Stack>
        <Stack sx={{ flex: "5" }}>
          {/* <Typography variant="h4">
            {getTermLabel(currentTerm)} {currentYear}
          </Typography> */}
          <Box sx={{ pb: "1rem" }}>
            {/* {renderTable({ tableData: courseListData })} */}
            <CustomTable
              data={courseListData}
              columns={columns}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              filters={true}
              showAllCourses={showAllCourses}
              handleShowAllCourses={handleShowAllCourses}
            />
            <MRT_ToolbarAlertBanner stackAlertBanner table={table} />
          </Box>
          <Stack sx={{ mt: "2rem" }}>
            {renderBlocks()}
            <Box sx={{ mt: "2rem" }}>
              {isTableVisible ? (
                <>
                  <Typography variant="h5">{currTableData.title}</Typography>
                  <CustomTable
                    data={currTableData.courses}
                    columns={sideTableColumns}
                    rowSelection={geRowSelection}
                    setRowSelection={setGeRowSelection}
                  />
                </>
              ) : null}
            </Box>
          </Stack>
        </Stack>
      </Stack>

      {/* ********************TEST END********************** */}
    </Box>
  );
};

export default CourseSelection;

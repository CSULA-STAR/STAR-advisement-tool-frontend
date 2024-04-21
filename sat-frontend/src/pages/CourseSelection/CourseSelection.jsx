import {
  Box,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  MRT_GlobalFilterTextField,
  MRT_TableBodyCellValue,
  MRT_TablePagination,
  MRT_ToolbarAlertBanner,
  flexRender,
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
// import { data } from "./makeData";
import SideTable from "./SideTable";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

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
  },
  // {
  //   accessorKey: "state",
  //   header: "State",
  // },
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
  const [checkboxResponses, setCheckboxResponses] = useState({});
  const navigate = useNavigate();
  const exCourses = useSelector((state) => state);
  const dispatch = useDispatch();
  const [navigationCount, setNavigationCount] = useState(0);
  const { courseList, startTerm, startYear } = location.state || {};
  const [genEduCourse, setGenEduCourse] = useState([]);
  const [currentTerm, setCurrentTerm] = useState(startTerm.value);
  const [currentYear, setCurrentYear] = useState(startYear);
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  useEffect(() => {
    setCourseListData(courseList);
  }, [courseList]);

  useEffect(() => {
    console.info({ rowSelection }); //read your managed row selection state
    // console.info(table.getState().rowSelection); //alternate way to get the row selection state
  }, [rowSelection]);
  useEffect(() => {
    const termCourseList = courseListData.filter((course) =>
      course.term.includes(toSentenceCase(currentTerm))
    );

    const genEdu = courseListData.filter(
      (course) => course.course_type === "general_education"
    );

    setGenEduCourse(genEdu);
    setTermData(termCourseList);
  }, [courseListData, currentTerm]);

  const handleCheckboxChange = (courseId, isChecked) => {
    setCheckboxResponses({ ...checkboxResponses, [courseId]: isChecked });
  };

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

  const handleRowSelectionChange = (selectedIndex, isChecked) => {
    const courseId = termData[selectedIndex]._id;
    setRowSelection((prevSelection) => ({
      ...prevSelection,
      [courseId]: isChecked,
    }));
  };

  const table = useMaterialReactTable({
    columns,
    data: termData,
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <MRT_GlobalFilterTextField table={table} />
            <FormControlLabel
              control={
                <Checkbox
                  checked={showAllCourses}
                  onChange={(e) => setShowAllCourses(e.target.checked)}
                />
              }
              label="Show all courses"
            />
          </Box>
          <TableContainer>
            <Table outlined>
              <TableHead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableCell align="center" variant="head" key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.Header ??
                                header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody>
                {table.getRowModel().rows.map((row, rowIndex) => (
                  <TableRow key={row.id} selected={row.getIsSelected()}>
                    {row.getVisibleCells().map((cell, _columnIndex) => (
                      <TableCell align="center" variant="body" key={cell.id}>
                        {cell.column.columnDef.accessorKey == "term" ? (
                          <Stack
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "center",
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
                        ) : (
                          <MRT_TableBodyCellValue
                            cell={cell}
                            table={table}
                            staticRowIndex={rowIndex}
                          />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <MRT_TablePagination table={table} />
          </TableContainer>
          <MRT_ToolbarAlertBanner stackAlertBanner table={table} />

          <Box>BOX1</Box>
        </Stack>
      </Stack>

      {/* ********************TEST END********************** */}
    </Box>
  );
};

export default CourseSelection;

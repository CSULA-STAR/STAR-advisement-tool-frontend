import PrintIcon from "@mui/icons-material/Print";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import PropTypes from "prop-types";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import "./selectedCoursesStyle.css";

const SelectedCoursesPage = () => {
  const courses = useSelector((state) => state);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
  useEffect(() => {
    const data = filteredCourses();
    setSelectedCourses(data);
  }, []);

  const filteredCourses = () => {
    return courses
      .filter((course) => course.selected_term.term)
      .map((course) => ({
        ...course,
        term: `${course.selected_term.term} ${course.selected_term.year}`,
      }));
  };

  const totalCredits = useMemo(
    () =>
      selectedCourses.reduce(
        (acc, curr) => Number(acc) + Number(curr.credits),
        0
      ),
    [selectedCourses]
  );

  const columns = useMemo(
    () => [
      {
        header: "Course Code",
        accessorKey: "course_code",
        enableGrouping: false,
        enableSorting: false,
        minSize: 100,
        maxSize: 400,
      },
      {
        header: "Course Name",
        accessorKey: "course_name",
        enableSorting: false,
        minSize: 400,
        maxSize: 600,
      },
      {
        header: "Credits",
        accessorKey: "credits",
        enableSorting: false,
        minSize: 100,
        maxSize: 300,
        aggregationFn: "sum",
        AggregatedCell: ({ cell }) => (
          <div>Terms Credits: {cell.getValue()}</div>
        ),
        Footer: () => (
          <Stack>
            Total Credits:
            <Box color="warning.main">{totalCredits}</Box>
          </Stack>
        ),
      },
      {
        header: "Term",
        accessorKey: "term",
        minSize: 100,
        maxSize: 500,
      },
    ],
    [totalCredits]
  );

  const table = useMaterialReactTable({
    columns,
    data: selectedCourses,
    enableStickyHeader: true,
    enableColumnDragging: false,
    enableColumnResizing: false,
    enableColumnActions: false,
    enableTopToolbar: false,
    enableBottomToolbar: false,
    enablePagination: false,
    enableGrouping: true,
    groupedColumnMode: "remove",
    enableStickyFooter: false,
    initialState: {
      density: "spacious",
      expanded: true,
      grouping: ["term"],
      // sorting: [{ id: "term", desc: false }],
    },
    muiTableContainerProps: { sx: { height: "100%", margin: 0, padding: 0 } },
    muiTableBodyCellProps: ({ row }) => ({
      sx: () => ({
        backgroundColor: row.depth === 0 ? "#ced4da" : null,
      }),
    }),
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: 0,
        border: "1px solid grey",
        display: "inline-flex",
      },
    },
  });

  return (
    <Box className="content-container" ref={printRef}>
      <Box className="table-heading">
        <Typography variant="h4" component="div">
          PLAN
        </Typography>
        <IconButton onClick={handlePrint}>
          <PrintIcon />
        </IconButton>
        <Stack justifyContent="center" alignItems="center" padding={3}></Stack>
      </Box>
      <MaterialReactTable className="mr-table" table={table} />
    </Box>
  );
};

SelectedCoursesPage.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  enableStickyHeader: PropTypes.bool,
  enableColumnDragging: PropTypes.bool,
  enableColumnResizing: PropTypes.bool,
  enableColumnActions: PropTypes.bool,
  enableTopToolbar: PropTypes.bool,
  enableBottomToolbar: PropTypes.bool,
  enablePagination: PropTypes.bool,
  enableGrouping: PropTypes.bool,
  groupedColumnMode: PropTypes.string,
  enableStickyFooter: PropTypes.bool,
  initialState: PropTypes.object,
  muiTableContainerProps: PropTypes.object,
  muiTablePaperProps: PropTypes.object,
};

export default SelectedCoursesPage;

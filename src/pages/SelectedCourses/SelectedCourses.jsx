import { Box, IconButton, Typography } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import { useMemo, useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import PropTypes from "prop-types";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import "./selectedCoursesStyle.css";

const SelectedCoursesPage = () => {
  const courses = useSelector((state) => state.selectedCourses);
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
          <Box sx={{ display: "flex", alignItems: "center" }}>
            Total Credits:
            <Box color="warning.main">{totalCredits}</Box>
          </Box>
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
      </Box>
      <MaterialReactTable className="mr-table" table={table} />
    </Box>
  );
};

SelectedCoursesPage.propTypes = {
  courses: PropTypes.array.isRequired,
};

export default SelectedCoursesPage;

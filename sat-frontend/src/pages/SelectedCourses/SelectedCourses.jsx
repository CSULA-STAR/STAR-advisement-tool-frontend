import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { data } from "./makeData";
import {
  Box,
  Stack,
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
import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { toSentenceCase } from "../../utils";

const SelectedCoursesPage = () => {
  console.log("CoursesFFFFF");
  const courses = useSelector((state) => state);
  console.log("CoursesFFFFF", courses);
  const [selectedCourses, setSelectedCourses] = useState([]);

  const filteredCourses = () => {
    return courses
      .filter((course) => course.selected_term.term)
      .map((course) => ({
        ...course,
        term: `${course.selected_term.term} ${course.selected_term.year}`,
      }));
  };
  useEffect(() => {
    const data = filteredCourses();
    setSelectedCourses(data);
  }, []);

  const totalCredits = useMemo(
    () => data.reduce((acc, curr) => Number(acc) + Number(curr), 0),
    []
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
        aggregationFn: "sum", //calc total points for each team by adding up all the points for each player on the team
        AggregatedCell: ({ cell }) => (
          <div>Term Total: {Number(cell.getValue())}</div>
        ),
        // aggregationFn: "sum",
        // AggregatedCell: ({ cell, table }) => (
        //   <>
        //     {table.getColumn(cell.row.groupingColumnId ?? "").columnDef.header}{" "}
        //     Credits:{" "}
        //     <Box
        //       sx={{ color: "info.main", display: "inline", fontWeight: "bold" }}
        //     >
        //       {cell.getValue()}
        //     </Box>
        //   </>
        // ),
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
        // Cell: ({ cell }) => (
        //   <Stack
        //     sx={{
        //       backgroundColor: "lightgrey",
        //     }}
        //   >
        //     {cell.getValue()}
        //   </Stack>
        // ),
      },
    ],
    [totalCredits]
  );

  const table = useMaterialReactTable({
    columns,
    data: selectedCourses,
    // displayColumnDefOptions: {
    //   "mrt-row-expand": {
    //     enableResizing: true,
    //   },
    // },
    enableStickyHeader: true,
    enableColumnDragging: false,
    enableColumnResizing: false,
    enableColumnActions: false,
    enableTopToolbar: false,
    enableBottomToolbar: false,
    enablePagination: false,
    enableGrouping: true,
    groupedColumnMode: "remove",
    // enableStickyHeader: true,
    enableStickyFooter: false,
    initialState: {
      density: "spacious",
      expanded: true, //expand all groups by default
      grouping: ["term"], //an array of columns to group by by default (can be multiple)
      // pagination: { pageIndex: 0, pageSize: 20 },
      sorting: [{ id: "term", desc: false }], //sort by state by default
    },
    muiToolbarAlertBannerChipProps: { color: "primary" },
    muiTableContainerProps: { sx: { maxHeight: 700 } },
    muiTablePaperProps: {
      elevation: 0, //change the mui box shadow
      //customize paper styles
      sx: {
        borderRadius: "0",
        border: "1px solid grey",
      },
    },
  });

  return (
    <Box
      sx={{ dislay: "flex", justifyContent: "center", alignContent: "center" }}
    >
      <Typography variant="h4" component="div">
        PLAN
      </Typography>
      <IconButton onClick={() => window.print()}>
        <PrintIcon />
      </IconButton>
      <Stack justifyContent="center" alignItems="center" padding={3}>
        <MaterialReactTable table={table} />
      </Stack>
    </Box>
  );
};

export default SelectedCoursesPage;

// import { useMemo, useState } from "react";
// import { MRT_Table, useMaterialReactTable } from "material-react-table";
// import { useSelector } from "react-redux";

// export const SelectedCoursesPage = () => {
//   const courses = useSelector((state) => state);
//   const [selectedCourses, setSelectedCourses] = useState([]);
//   const columns = useMemo(
//     //column definitions...
//     () => [
//       {
//         accessorKey: "course_code",
//         header: "Course",
//       },
//       {
//         accessorKey: "course_name",
//         header: "Course Name",
//       },
//       {
//         accessorKey: "credits",
//         header: "Credits",
//         aggregationFn: "sum",
//         AggregatedCell: ({ cell }) => <div>Total Score: {cell.getValue()}</div>,
//         Footer: () => <div color="warning.main">{Math.round(21)}</div>,
//       },
//     ],
//     []
//   );

//   const coursesByTermAndYear = () => {
//     const courses = {};
//     selectedCourses.forEach((course) => {
//       if (course?.selected_term) {
//         const { term, year } = course.selected_term;
//         if (!courses[year]) {
//           courses[year] = {};
//         }
//         if (!courses[year][term]) {
//           courses[year][term] = [];
//         }
//         courses[year][term].push(course);
//       }
//     });
//     return courses;
//   };

//   const table = useMaterialReactTable({
//     columns,
//     data: courses,
//     enableColumnActions: false,
//     enableColumnFilters: false,
//     enablePagination: false,
//     enableSorting: false,
//     mrtTheme: (theme) => ({
//       baseBackgroundColor: theme.palette.background.default, //change default background color
//     }),
//     muiTableBodyRowProps: { hover: false },
//     muiTableProps: {
//       sx: {
//         border: "1px solid rgba(81, 81, 81, .5)",
//         caption: {
//           captionSide: "top",
//         },
//       },
//     },
//     muiTableHeadCellProps: {
//       sx: {
//         border: "1px solid rgba(81, 81, 81, .5)",
//         fontStyle: "italic",
//         fontWeight: "normal",
//       },
//     },
//     muiTableBodyCellProps: {
//       sx: {
//         border: "1px solid rgba(81, 81, 81, .5)",
//       },
//     },
//     renderCaption: ({ table }) =>
//       `Here is a table rendered with the lighter weight MRT_Table sub-component, rendering ${
//         table.getRowModel().rows.length
//       } rows.`,
//   });

//   //using MRT_Table instead of MaterialReactTable if we do not need any of the toolbar components or features
//   return <MRT_Table table={table} />;
// };

// export default SelectedCoursesPage;

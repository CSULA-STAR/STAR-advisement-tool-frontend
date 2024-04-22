import { useMemo } from "react";
import {
  MRT_Table, //import alternative sub-component if we do not want toolbars
  useMaterialReactTable,
} from "material-react-table";

export const SideTable = ({ data }) => {
  const coursesByTerm = data?.reduce((acc, course) => {
    const { term, year } = course.selected_term;
    const key = `${term?.toLowerCase()} ${year}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(course);
    return acc;
  }, {});
  console.log("coursesByTerm", coursesByTerm);
  const tData = Object.entries(coursesByTerm).map(([term, courses]) => ({
    term,
    courses: courses.map((course) => course.course_name).join(", "),
  }));
  console.log("tData:", tData);

  const columns = useMemo(
    () => [
      {
        accessorKey: "termCourses",
        Cell: ({ row }) => (
          <div>
            <div>
              <strong>{row.original.term}</strong>
            </div>
            <div>{row.original.courses}</div>
          </div>
        ),
        Header: ({ column }) => {
          console.log("coolumns fara", column);
          return <div>abcd</div>;
        },
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: tData,
    enableColumnActions: false,
    enableColumnFilters: false,
    enablePagination: false,
    enableSorting: false,
    mrtTheme: (theme) => ({
      baseBackgroundColor: theme.palette.background.default, //change default background color
    }),
    muiTableBodyRowProps: { hover: false },
    muiTableProps: {
      sx: {
        border: "1px solid rgba(81, 81, 81, .5)",
        caption: {
          captionSide: "top",
        },
      },
    },
    muiTableHeadCellProps: {
      sx: {
        border: "1px solid rgba(81, 81, 81, .5)",
        fontWeight: "normal",
      },
    },
    muiTableBodyCellProps: {
      sx: {
        border: "1px solid rgba(81, 81, 81, .5)",
      },
    },
    renderCaption: ({ table }) => `Terms`,
  });

  return <MRT_Table table={table} />;
};

export default SideTable;

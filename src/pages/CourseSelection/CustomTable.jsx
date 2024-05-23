import { Checkbox, FormControlLabel, Typography } from "@mui/material";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import PropTypes from "prop-types";

const CustomTable = ({
  columns,
  data,
  rowSelection,
  setRowSelection,
  filters,
  showAllCourses,
  handleShowAllCourses,
}) => {
  const table = useMaterialReactTable({
    columns,
    data,
    enableRowSelection: (row) => !row.original?.isNewlyAdded,
    getRowId: (row) => row._id,
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
    initialState: {
      sorting: [
        {
          id: columns[0].accessorKey,
          desc: true,
        },
      ],
      pagination: { pageSize: 5, pageIndex: 0 },
      showGlobalFilter: true,
    },
    muiPaginationProps: {
      rowsPerPageOptions: [5, 10, 15],
      variant: "outlined",
    },
    paginationDisplayMode: "pages",
    muiTableBodyCellProps: ({ row }) => ({
      sx: {
        backgroundColor: row?.original?.isNewlyAdded ? "lightgrey" : "inherit",
      },
    }),

    renderEmptyRowsFallback: () => (
      <Typography variant="body1">No courses available</Typography>
    ),
    renderTopToolbarCustomActions: ({ table }) =>
      filters && (
        <FormControlLabel
          control={
            <Checkbox
              checked={showAllCourses}
              onChange={(e) => handleShowAllCourses(e.target.checked)}
            />
          }
          label="Show all courses"
        />
      ),
  });

  return <MaterialReactTable table={table} />;
};

CustomTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  rowSelection: PropTypes.object.isRequired,
  setRowSelection: PropTypes.func.isRequired,
  filters: PropTypes.bool.isRequired,
  showAllCourses: PropTypes.bool.isRequired,
  handleShowAllCourses: PropTypes.func.isRequired,
  currentTerm: PropTypes.string.isRequired,
  currentYear: PropTypes.number.isRequired,
};

export default CustomTable;

import { Typography } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import PropTypes from "prop-types";
import React from "react";

const CustomTable = ({
  columns,
  data,
  rowSelection,
  setRowSelection,
  filters,
  showAllCourses,
  handleShowAllCourses,
  handleRowSelectionChange,
}) => {
  const table = useMaterialReactTable({
    columns,
    data,
    enableRowSelection: true,
    getRowId: (originalRow) => originalRow._id,
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
    initialState: {
      sorting: [
        {
          id: columns[0].accessorKe,
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
    renderEmptyRowsFallback: () => (
      <Typography variant="body1">No courses available</Typography>
    ),
    muiTableBodyRowProps: ({ row }) => ({
      onClick: (event) => {
        console.info(event, row.id);
      },
      sx: {
        cursor: "pointer",
      },
    }),
    renderTopToolbarCustomActions: ({ table }) => (
      <>
        {filters ? (
          <FormControlLabel
            control={
              <Checkbox
                checked={showAllCourses}
                onChange={(e) => handleShowAllCourses(e.target.checked)}
              />
            }
            label="Show all courses"
          />
        ) : null}
      </>
    ),
  });

  return <MaterialReactTable table={table} />;
};

CustomTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  rowSelection: PropTypes.array.isRequired,
  setRowSelection: PropTypes.func.isRequired,
};

export default CustomTable;

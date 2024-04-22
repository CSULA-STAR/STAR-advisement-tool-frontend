import {
  Box,
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
  flexRender,
  useMaterialReactTable,
  MaterialReactTable,
} from "material-react-table";
import PropTypes from "prop-types";
import React from "react";
import { abbreviateTerm } from "../../utils";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
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
    enableRowSelection: true,
    // enableExpanding: true,
    muiTableBodyRowProps: ({ row }) => ({
      onClick: (event) => {
        console.info(event, row.id);
      },
      sx: {
        cursor: "pointer",
      },
    }),
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
    renderEmptyRowsFallback: () => (
      <Typography variant="body1">No courses available</Typography>
    ),
    muiTableProps: {
      sx: {
        border: "1px solid lightgrey",
        caption: {
          captionSide: "top",
        },
      },
    },
    muiTableHeadCellProps: {
      sx: {
        // border: "1px solid black",
        fontWeight: "bold",
      },
    },
    muiTableBodyCellProps: {
      sx: {
        // border: "px solid black",
      },
    },

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

  return (
    <>
      <MaterialReactTable table={table} />
      {/*

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <MRT_GlobalFilterTextField table={table} />
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
      </Box>

      {rows.length > 0 ? (
        <> 
        <TableContainer>
            <Table sx={{ border: "1px solid lightgrey" }}>
              <TableHead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableCell align="left" variant="head" key={header.id}>
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
                {rows.map((row, rowIndex) => (
                  <TableRow key={row.id} selected={row.getIsSelected()}>
                    {row.getVisibleCells().map((cell, _columnIndex) => (
                      <TableCell align="left" variant="body" key={cell.id}>
                        {cell.column.columnDef.accessorKey === "term" ? (
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
        </>
      ) : (
        <Typography variant="body1">No courses available</Typography>
      )}*/}
    </>
  );
};

CustomTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  rowSelection: PropTypes.array.isRequired,
  setRowSelection: PropTypes.func.isRequired,
};

export default CustomTable;

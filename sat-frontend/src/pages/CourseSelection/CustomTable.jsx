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
  setShowAllCourses,
}) => {
  const table = useMaterialReactTable({
    columns,
    data,
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
    renderEmptyRowsFallback: ({ table }) => (
      <span>Customized No Rows Overlay</span>
    ),
    muiTableProps: {
      sx: {
        border: "1px solid black",
        caption: {
          captionSide: "top",
        },
      },
    },
    muiTableHeadCellProps: {
      sx: {
        border: "1px solid black",
        fontStyle: "italic",
        fontWeight: "normal",
      },
    },
    muiTableBodyCellProps: {
      sx: {
        border: "1px solid black",
      },
    },
  });

  const rows = table.getRowModel().rows;

  return (
    <>
      {rows.length > 0 ? (
        <>
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
                    onChange={(e) => setShowAllCourses(e.target.checked)}
                  />
                }
                label="Show all courses"
              />
            ) : null}
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
                {rows.map((row, rowIndex) => (
                  <TableRow key={row.id} selected={row.getIsSelected()}>
                    {row.getVisibleCells().map((cell, _columnIndex) => (
                      <TableCell align="center" variant="body" key={cell.id}>
                        {cell.column.columnDef.accessorKey === "term" ? (
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
        </>
      ) : (
        <Typography variant="body1">No courses available</Typography>
      )}
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

import { useMemo } from "react";
import {
  MRT_Table, //import alternative sub-component if we do not want toolbars
  useMaterialReactTable,
} from "material-react-table";

export const SideTable = ({ data }) => {
  console.log("data:", data);
  const columns = useMemo(
    () => [
      {
        accessorKey: "term",
        header: "Term",
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data,
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

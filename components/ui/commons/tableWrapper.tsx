import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter } from "lucide-react";

interface TableWrapperProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  title?: string;
  loading?: boolean;
  filtersSlot?: React.ReactNode;
  bulkActionsSlot?: React.ReactNode;
  rightHeaderContent?: React.ReactNode;
  rowSubComponent?: (row: TData) => React.ReactNode;
  showLocalSearch?: boolean;
  showPagination?: boolean;
  pageSizeOptions?: number[];
  onSelectionChange?: (selectedRows: TData[]) => void;
}

export function TableWrapper<TData>({
  data = [],
  columns,
  title = "Table Data",
  loading = false,
  filtersSlot,
  bulkActionsSlot,
  rightHeaderContent,
  rowSubComponent,
  showLocalSearch = true,
  showPagination = true,
  pageSizeOptions = [10, 20, 50],
  onSelectionChange,
}: TableWrapperProps<TData>) {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);
  const [rowSelection, setRowSelection] = React.useState({} as Record<string, boolean>);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      pagination,
      rowSelection,
    },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
  });

  React.useEffect(() => {
    if (typeof onSelectionChange === "function") {
      const selected = table
        .getSelectedRowModel()
        .flatRows.map((r) => r.original as TData);
      onSelectionChange(selected);
    }
  }, [rowSelection, table, onSelectionChange]);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <CardTitle>{title}</CardTitle>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            {showLocalSearch && (
              <div className="relative flex-1 min-w-0 sm:max-w-sm">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={globalFilter ?? ""}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            )}
            <div className="flex gap-2 items-center">
              {filtersSlot && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                  className="flex-1 sm:flex-none"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              )}
              {showLocalSearch && globalFilter && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setGlobalFilter("")}
                  className="flex-1 sm:flex-none"
                >
                  Clear
                </Button>
              )}
              {rightHeaderContent}
            </div>
          </div>
        </div>

        {isFiltersOpen && filtersSlot && (
          <div className="mt-4">{filtersSlot}</div>
        )}
      </CardHeader>

      <CardContent className="h-full">
        {bulkActionsSlot && <div className="mb-4">{bulkActionsSlot}</div>}

        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {loading ? (
                          <Skeleton className="h-4 w-[120px]" />
                        ) : (
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array(table.getState().pagination.pageSize)
                    .fill(null)
                    .map((_, index) => (
                      <TableRow key={index}>
                        {columns.map((_, colIndex) => (
                          <TableCell key={colIndex}>
                            <Skeleton className="h-4 w-[100px] mx-auto" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                ) : table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <React.Fragment key={row.id}>
                      <TableRow>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                      {typeof (rowSubComponent) === 'function' && (
                        <TableRow>
                          <TableCell colSpan={columns.length}>
                            {rowSubComponent(row.original)}
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="text-center py-12"
                    >
                      <div className="text-muted-foreground">
                        No results found.
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        {showPagination && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 pt-4 border-t border-border">
            <div className="flex items-center gap-3">
              <div className="text-sm text-muted-foreground">
                {loading ? (
                  <Skeleton className="h-4 w-[140px]" />
                ) : (
                  `Page ${
                    table.getState().pagination.pageIndex + 1
                  } of ${table.getPageCount()}`
                )}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Rows per page:</span>
                <select
                  className="border rounded px-2 py-1 bg-background"
                  value={table.getState().pagination.pageSize}
                  onChange={(e) =>
                    table.setPageSize(Number(e.target.value))
                  }
                  disabled={loading}
                >
                  {pageSizeOptions.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage() || loading}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage() || loading}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

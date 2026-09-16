import PaginationBar from "@/components/shared/PaginationBar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const DataTable = ({
        columns = [],
        data = [],
        keyField = "id",
        asyncState = { isLoading: false, error: null },
        pagination = null,
        filter = null, 
        updateFilter = null,
        selectedItem = null,
        onRowClick = null,
        onRowDoubleClick = null,
        emptyMessage = "No records found.",
    }) => {
        const isLoading = asyncState?.isLoading;
        const hasData = Array.isArray(data) && data.length > 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col overflow-hidden min-h-50 mb-4">
      <div className="overflow-x-auto flex-1">
        <Table>
          <TableHeader>
            <TableRow className="">
              {columns.map((col, idx) => (
                <TableHead
                  key={col.key || col.accessorKey || idx}
                  className={`font-semibold ${col.headerClassName || ""}`}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-10 text-custom-gray"
                >
                  Loading data...
                </TableCell>
              </TableRow>
            ) : !hasData ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-10 text-custom-gray font-medium"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
                (data || []).map((row) => {
                  const isSelected = selectedItem && row[keyField] === selectedItem[keyField];
                  return (
                    <TableRow
                      key={row[keyField]}
                      onClick={() => onRowClick && onRowClick(row)}
                      onDoubleClick={() => onRowDoubleClick && onRowDoubleClick(row)}
                      className={`transition-colors ${
                        onRowClick || onRowDoubleClick ? "hover: cursor-pointer" : ""
                      } 
                      ${
                        isSelected
                          ? "bg-blue-200! hover:bg-blue-200!"
                          : "hover:bg-slate-50"
                      }`}
                    >
                    {columns.map((col, idx) => (
                      <TableCell
                        key={col.key || col.accessorKey || idx}
                        className={col.className || "text-custom-gray"}
                      >
                        {col.render ? col.render(row) : row[col.accessorKey]}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      
      {hasData && !isLoading && pagination && filter && updateFilter && (
        <PaginationBar
          pageCount={filter.pageCount}
          pageSize={filter.pageSize}
          totalPages={pagination.totalPages}
          totalEntries={pagination.totalEntries}
          updateFilter={updateFilter}
        />
      )}
    </div>
  );
};

export default DataTable;
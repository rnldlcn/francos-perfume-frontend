import { ChevronLeft, ChevronRight } from "lucide-react";


const PaginationBar = ({ pageCount, pageSize, totalPages, totalEntries, updateFilter }) => {
  return (
        <div className="flex justify-between items-center mt-auto pt-6 pb-2 text-sm text-gray-400">
          <p>
            Showing {((pageCount - 1) * pageSize) + 1} to {Math.min(pageCount * pageSize, totalEntries)} of {totalEntries} entries
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => updateFilter('pageCount', Math.max(1, pageCount - 1))}
              disabled={pageCount === 1}
              className={`text-2xl transition-colors ${pageCount === 1 ? "text-muted cursor-not-allowed" : "hover: cursor-pointer"}`}
            >
            <ChevronLeft className="w-4 h-4"/>
            </button>
            <span className="text-gray-500 font-medium">{pageCount} / {totalPages|| 1}</span>
            <button
              onClick={() => updateFilter('pageCount', Math.min(pageCount + 1))}
              disabled={pageCount >= totalPages}
              className={`text-2xl transition-colors ${pageCount === totalPages ? "cursor-not-allowed" : " hover:cursor-pointer"}`}>
            <ChevronRight className="w-4 h-4"/>
            </button>
          </div>
        </div>
    )
}

export default PaginationBar;
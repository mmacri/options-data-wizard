
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

export function DataTablePagination({ 
  currentPage, 
  totalPages, 
  setCurrentPage 
}: PaginationProps) {
  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <button
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-9 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
        aria-label="Previous page"
      >
        Previous
      </button>
      <span className="text-sm">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-9 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
}

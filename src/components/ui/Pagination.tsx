import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { Fragment, useCallback, useMemo } from "react";

type PaginationProps = {
  className?: string;
  total: number;
  limit: number;
  page: number;
  setLimit: (limit: number) => void;
  setPage: (page: number) => void;
  options?: number[];
  showInfo?: boolean;
};

const Pagination: React.FC<PaginationProps> = ({
  className,
  total,
  limit,
  page,
  setLimit,
  setPage,
  options: limitOptions = [5, 10, 20, 50],
  showInfo = true,
}) => {
  const totalPages = Math.ceil(total / limit);
  const startItem = Math.min((page - 1) * limit + 1, total);
  const endItem = Math.min(page * limit, total);

  const pages = useMemo(() => {
    if (totalPages <= 1) return [];

    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    // Always include first page
    if (totalPages >= 1) {
      rangeWithDots.push(1);
    }

    // Calculate middle range
    const start = Math.max(2, page - delta);
    const end = Math.min(totalPages - 1, page + delta);

    // Add dots before middle range if needed
    if (start > 2) {
      rangeWithDots.push("...");
    }

    // Add middle range
    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== totalPages) {
        range.push(i);
      }
    }
    rangeWithDots.push(...range);

    // Add dots after middle range if needed
    if (end < totalPages - 1) {
      rangeWithDots.push("...");
    }

    // Always include last page if it's different from first
    if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  }, [page, totalPages]);

  const handleLimitChange = useCallback(
    (newLimit: number) => {
      // Calculate what the new page should be to keep the user roughly in the same position
      const currentFirstItem = (page - 1) * limit + 1;
      const newPage = Math.max(1, Math.ceil(currentFirstItem / newLimit));

      setLimit(newLimit);
      setPage(newPage);
    },
    [page, limit, setLimit, setPage],
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setPage(newPage);
      }
    },
    [totalPages, setPage],
  );

  // Don't render if there's no data or only one page
  if (total === 0) return null;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-between gap-4 px-4 py-3 sm:flex-row sm:gap-0",
        className,
      )}
    >
      {/* Results Info */}
      {showInfo && (
        <div className="text-sm text-gray-700 dark:text-gray-300">
          {total > 0 ? (
            <>
              Showing <span className="font-medium">{startItem}</span> to{" "}
              <span className="font-medium">{endItem}</span> of{" "}
              <span className="font-medium">{total}</span> results
            </>
          ) : (
            "No results found"
          )}
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
        {/* Limit Selector */}
        <div className="flex items-center space-x-2">
          <label
            htmlFor="limit"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Rows per page:
          </label>
          <select
            id="limit"
            value={limit}
            onChange={(e) => handleLimitChange(Number(e.target.value))}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400"
          >
            {limitOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Pagination Buttons */}
        {totalPages > 1 && (
          <div className="flex items-center space-x-1">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Page Numbers */}
            {pages.map((p, index) => (
              <Fragment key={`page-${index}`}>
                {p === "..." ? (
                  <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    ...
                  </span>
                ) : (
                  <button
                    onClick={() => handlePageChange(p as number)}
                    className={cn(
                      "inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                      p === page
                        ? "border-blue-500 bg-blue-50 text-blue-600 dark:border-blue-400 dark:bg-blue-900/20 dark:text-blue-400"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700",
                    )}
                    aria-label={`Go to page ${p}`}
                    aria-current={p === page ? "page" : undefined}
                  >
                    {p}
                  </button>
                )}
              </Fragment>
            ))}

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export { Pagination };

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { Fragment, useMemo } from "react";

type PaginationProps = {
  className?: string;
  total: number;
  limit: number;
  page: number;
  setLimit: (limit: number) => void;
  setPage: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  total,
  limit,
  page,
  setLimit,
  setPage,
}) => {
  const totalPages = Math.ceil(total / limit);
  const pages = useMemo(() => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(totalPages - 1, page + delta);
      i++
    ) {
      range.push(i);
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (page + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  }, [page, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2 py-4">
      <button
        onClick={() => setPage(page - 1)}
        disabled={page <= 1}
        className="rounded-md border border-gray-300 p-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((page, index) => (
        <Fragment key={index}>
          {page === "..." ? (
            <span className="px-3 py-2">...</span>
          ) : (
            <button
              onClick={() => setPage(page as number)}
              className={cn(
                "rounded-md border px-3 py-2",
                page === page
                  ? "border-blue-500 bg-blue-500 text-white"
                  : "border-gray-300 hover:bg-gray-50",
              )}
            >
              {page}
            </button>
          )}
        </Fragment>
      ))}

      <button
        onClick={() => setPage(page + 1)}
        disabled={page >= totalPages}
        className="rounded-md border border-gray-300 p-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};

export { Pagination };

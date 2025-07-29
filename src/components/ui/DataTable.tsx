import { useQueryState } from "@/hooks/ui/useQueryState";
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";
import React, { useCallback, useMemo } from "react";
import { Pagination } from "./Pagination";
import { Table } from "./Table";

// Types
export type TColumn<T> = {
  name: string;
  field: keyof T;
  isSortable?: boolean;
  isSpecial?: boolean;
  formatter?: (
    cell: T[keyof T],
    row: T,
    index: number,
  ) => React.ReactNode | string | number | null | undefined;
};

export type TDataTableProps<T> = {
  columns: TColumn<T>[];
  data: T[];
  config?: {
    isSortProcessed?: boolean;
    isPaginationProcessed?: boolean;
    isViewSort?: boolean;
    isViewPagination?: boolean;
  };
  state?: {
    sort?: string;
    page?: number;
    limit?: number;
    total?: number;
    onSortChange?: (sort: string) => void;
    onPageChange?: (page: number) => void;
    onLimitChange?: (limit: number) => void;
  };
};

type CellContentProps<T> = {
  value: T[keyof T];
  formatter?: (
    cell: T[keyof T],
    row: T,
    index: number,
  ) => React.ReactNode | string | number | null | undefined;
  row: T;
  rowIndex: number;
};

// FIXED Pagination Hook - Logic corrected!
const usePagination = <T extends Record<string, unknown>>(
  data: T[],
  page: number,
  limit: number,
  isPaginationProcessed: boolean = false,
) => {
  const paginatedData = useMemo(() => {
    if (isPaginationProcessed) {
      return data;
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const slicedData = data.slice(startIndex, endIndex);

    return slicedData;
  }, [data, page, limit, isPaginationProcessed]);

  return paginatedData;
};

// FIXED Sorting Hook - Logic corrected!
const useSorting = <T extends Record<string, unknown>>(
  data: T[],
  sort?: string,
  isSortProcessed: boolean = false,
): T[] => {
  const sortedData = useMemo(() => {
    if (isSortProcessed) {
      return data;
    }

    if (!sort || sort === "") {
      return data;
    }

    // Handle client-side sorting
    const sortField = sort.startsWith("-") ? sort.slice(1) : sort;
    const isDescending = sort.startsWith("-");

    return [...data].sort((a, b) => {
      const aValue = a[sortField as keyof T];
      const bValue = b[sortField as keyof T];

      if (aValue === bValue) return 0;

      let comparison = 0;

      // Handle different data types
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (typeof aValue === "number" && typeof bValue === "number") {
        comparison = aValue - bValue;
      } else if (typeof aValue === "string" && typeof bValue === "string") {
        comparison = aValue.localeCompare(bValue);
      } else if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime();
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return isDescending ? -comparison : comparison;
    });
  }, [data, sort, isSortProcessed]);

  return sortedData;
};

const getSortIcon = (field: string, sort?: string) => {
  if (sort === field) {
    return <ChevronUp className="h-4 w-4" />;
  } else if (sort === `-${field}`) {
    return <ChevronDown className="h-4 w-4" />;
  }
  return <ChevronsUpDown className="h-4 w-4" />;
};

// Cell Content Component
export const CellContent = <T extends Record<string, unknown>>({
  value,
  formatter,
  row,
  rowIndex,
}: CellContentProps<T>) => {
  const renderValue = (val: unknown): React.ReactNode => {
    if (React.isValidElement(val)) return val;

    if (val === null || val === undefined) return "";

    if (
      typeof val === "string" ||
      typeof val === "number" ||
      typeof val === "boolean"
    ) {
      return String(val);
    }

    if (Array.isArray(val)) {
      if (
        val.every(
          (item) => typeof item === "string" || typeof item === "number",
        )
      ) {
        return (val as (string | number)[]).join(", ");
      }
      return JSON.stringify(val);
    }

    if (typeof val === "object") {
      return JSON.stringify(val);
    }

    return String(val);
  };

  if (formatter) {
    return <>{formatter(value, row, rowIndex)}</>;
  }

  return <>{renderValue(value)}</>;
};

// Fixed DataTable Component
const DataTable = <T extends Record<string, unknown>>({
  columns: headers,
  data,
  config,
  state,
}: TDataTableProps<T>) => {
  const {
    isSortProcessed = false,
    isPaginationProcessed = false,
    isViewSort = true,
    isViewPagination = true,
  } = config || {};

  const { sort, page, limit, onSortChange, onPageChange, onLimitChange } =
    useQueryState({
      sort: state?.sort,
      page: state?.page,
      limit: state?.limit,
      onSortChange: state?.onSortChange,
      onPageChange: state?.onPageChange,
      onLimitChange: state?.onLimitChange,
    });

  // Calculate pagination values
  const currentSort = sort || "";
  const currentPage = page || 1;
  const currentLimit = limit || 10;

  // Determine total count based on processing type
  const totalCount = useMemo(() => {
    if (isPaginationProcessed && typeof state?.total === "number") {
      return state?.total;
    } else {
      return data.length;
    }
  }, [isPaginationProcessed, state?.total, data.length]);

  // Apply sorting first
  const sortedData = useSorting(data, currentSort, isSortProcessed);

  // Apply pagination
  const paginatedData = usePagination(
    sortedData,
    currentPage,
    currentLimit,
    isPaginationProcessed,
  );

  const getFieldValue = useCallback((row: T, field: keyof T): T[keyof T] => {
    return row[field];
  }, []);

  // Sort handler
  const handleSortClick = useCallback(
    (field: string) => {
      let newSort: string;

      if (currentSort === field) {
        newSort = `-${field}`;
      } else if (currentSort === `-${field}`) {
        newSort = "";
      } else {
        newSort = field;
      }
      onSortChange(newSort);
    },
    [currentSort, onSortChange],
  );

  // Page handler
  const handlePageChange = useCallback(
    (page: number) => {
      onPageChange(page);
    },
    [onPageChange],
  );

  // Limit handler
  const handleLimitChange = useCallback(
    (limit: number) => {
      onLimitChange(limit);
    },
    [onLimitChange],
  );

  return (
    <div className="w-full space-y-4">
      <div className="rounded-nd overflow-x-auto border px-4">
        <Table className="w-full">
          <Table.Header>
            <Table.Row>
              {headers.map((header, index) => (
                <Table.Head key={`header-${header.field as string}-${index}`}>
                  {header.isSortable && isViewSort ? (
                    <button
                      className="flex items-center space-x-1 text-left transition-colors hover:text-gray-900 dark:hover:text-gray-100"
                      onClick={() => handleSortClick(header.field as string)}
                      type="button"
                    >
                      <span>{header.name}</span>
                      {getSortIcon(header.field as string, currentSort)}
                    </button>
                  ) : (
                    <span>{header.name}</span>
                  )}
                </Table.Head>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {paginatedData.length === 0 ? (
              <Table.Row>
                <Table.Cell
                  colSpan={headers.length}
                  className="py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  No data available
                </Table.Cell>
              </Table.Row>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <Table.Row key={`row-${rowIndex}`}>
                  {headers.map((header, cellIndex) => (
                    <Table.Cell key={`cell-${rowIndex}-${cellIndex}`}>
                      <CellContent
                        value={getFieldValue(row, header.field)}
                        formatter={header.formatter}
                        row={row}
                        rowIndex={rowIndex}
                      />
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table>
      </div>

      {isViewPagination && totalCount > 0 && (
        <Pagination
          total={totalCount}
          limit={currentLimit}
          page={currentPage}
          setLimit={handleLimitChange}
          setPage={handlePageChange}
        />
      )}
    </div>
  );
};

export default DataTable;

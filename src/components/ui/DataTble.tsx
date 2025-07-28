import { useQueryState } from "@/hooks/ui/useQueryState";
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";
import React, { useMemo } from "react";
import { Pagination } from "./Pagination";
import { Table } from "./Table";

// Types
type TColumn<T> = {
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

type TDataTableProps<T> = {
  columns: TColumn<T>[];
  data: T[];
  metadata?: { total?: number; page?: number; limit?: number };
  config?: {
    isSortProcessed?: boolean;
    isPaginationProcessed?: boolean;
  };
  query: {
    sort?: string;
    page?: number;
    limit?: number;
  };
  setQuery: (
    query: Partial<{ sort?: string; page?: number; limit?: number }>,
  ) => void;
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

// Pagination Hook
const usePagination = <T extends Record<string, unknown>>(
  data: T[],
  page: number,
  limit: number,
  disabled?: boolean,
) => {
  const paginatedData = useMemo(() => {
    if (!disabled) {
      return data;
    }
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return data.slice(startIndex, endIndex);
  }, [data, page, limit, disabled]);
  return paginatedData;
};

// Sorting Hook
const useSorting = <T extends Record<string, unknown>>(
  data: T[],
  sort?: string,
  disabled?: boolean,
): T[] => {
  const sortedData = useMemo(() => {
    if (disabled || !sort) {
      return data;
    }
    const sortField = sort.startsWith("-") ? sort.slice(1) : sort;
    const isDescending = sort.startsWith("-");

    return [...data].sort((a, b) => {
      const aValue = a[sortField as keyof T];
      const bValue = b[sortField as keyof T];

      if (aValue === bValue) return 0;

      let comparison = 0;
      if (typeof aValue === "number" && typeof bValue === "number") {
        comparison = aValue > bValue ? 1 : -1;
      } else if (typeof aValue === "string" && typeof bValue === "string") {
        comparison = aValue.localeCompare(bValue);
      }
      return isDescending ? -comparison : comparison;
    });
  }, [data, sort, disabled]);

  return sortedData;
};

const sortToggler = (
  field: string,
  sort?: string,
  setSort?: (sort: string) => void,
) => {
  let newSort: string;

  if (sort === field) {
    newSort = `-${field}`;
  } else if (sort === `-${field}`) {
    newSort = "";
  } else {
    newSort = field;
  }

  setSort?.(newSort);
};

const getSortIcon = (field: string, sort?: string) => {
  if (sort === field) {
    return <ChevronUp className="h-4 w-4" />;
  } else if (sort === `-${field}`) {
    return <ChevronDown className="h-4 w-4" />;
  }
  return <ChevronsUpDown className="h-4 w-4" />;
};

export const CellContent = <T extends Record<string, unknown>>({
  value,
  formatter,
  row,
  rowIndex,
}: CellContentProps<T>) => {
  const renderValue = (val: unknown): React.ReactNode => {
    if (React.isValidElement(val)) return val;

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

    return null;
  };

  if (formatter) {
    return <>{formatter(value, row, rowIndex)}</>;
  }

  return <>{renderValue(value)}</>;
};

// Main DataTable Component
const DataTable = <T extends Record<string, unknown>>({
  columns: headers,
  data,
  metadata = { total: 100 },
  config = {},
  query: queryProp = { sort: "", page: 1, limit: 12 },
  setQuery: setQueryProp,
}: TDataTableProps<T>) => {
  const { isSortProcessed = false, isPaginationProcessed = false } = config;
  const { query, onSortChange, onPageChange, onLimitChange } = useQueryState(
    queryProp,
    setQueryProp,
  );

  const total = metadata.total || data.length;
  const page = query.page || 1;
  const limit = query.limit || metadata.total || 12;

  const sortedData = useSorting(data, query.sort, !isSortProcessed);
  const paginatedData = usePagination(
    sortedData,
    page,
    limit,
    !isPaginationProcessed,
  );

  const getFieldValue = (row: T, field: keyof T): T[keyof T] => row[field];

  return (
    <div className="w-full">
      <div className="rounded-lg border">
        <Table>
          <Table.Header>
            <Table.Row>
              {headers.map((header, index) => (
                <Table.Head key={index}>
                  {header.isSortable ? (
                    <button
                      className="flex items-center space-x-1 transition-colors hover:text-gray-900"
                      onClick={() =>
                        sortToggler(
                          header.field as string,
                          query.sort,
                          onSortChange,
                        )
                      }
                    >
                      <span>{header.name}</span>
                      {getSortIcon(header.field as string, query.sort)}
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
                  className="py-8 text-center text-gray-500"
                >
                  No data available
                </Table.Cell>
              </Table.Row>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <Table.Row key={rowIndex}>
                  {headers.map((header, cellIndex) => (
                    <Table.Cell key={cellIndex}>
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

      <Pagination
        total={total}
        limit={limit}
        page={page}
        setLimit={onLimitChange}
        setPage={onPageChange}
      />
    </div>
  );
};

export default DataTable;

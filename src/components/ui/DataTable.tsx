import { useQueryState } from "@/hooks/ui/useQueryState";
import debounce from "@/utils/debounce";
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";
import { Dropdown } from "./Dropdown";
import { FormControl } from "./FormControl";
import { Pagination } from "./Pagination";
import { Table } from "./Table";

// Types
export type TColumn<T> = {
  name: string;
  field: keyof T;
  isSortable?: boolean;
  isSearchable?: boolean;
  head?: (info: {
    head: TColumn<T>;
  }) => React.ReactNode | string | number | null | undefined;
  cell?: (info: {
    cell: T[keyof T];
    row: T;
    index: number;
  }) => React.ReactNode | string | number | null | undefined;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  align?: "start" | "center" | "end";
  style?: React.CSSProperties;
  className?: string;
};

export type TDataTableProps<T> = {
  title?: string;
  slot?: React.ReactNode | string | number | null | undefined;
  status?: string;
  columns: TColumn<T>[];
  data: T[];
  config?: {
    isSearchProcessed?: boolean;
    isSortProcessed?: boolean;
    isPaginationProcessed?: boolean;
    isViewSearch?: boolean;
    isViewSort?: boolean;
    isViewPagination?: boolean;
  };
  state?: {
    search?: string;
    sort?: string;
    page?: number;
    limit?: number;
    total?: number;
    onSearchChange?: (search: string) => void;
    onSortChange?: (sort: string) => void;
    onPageChange?: (page: number) => void;
    onLimitChange?: (limit: number) => void;
  };
};

type CellContentProps<T> = {
  index: number;
  row: T;
  cell: T[keyof T];
  formatter?: (info: {
    index: number;
    row: T;
    cell: T[keyof T];
  }) => React.ReactNode | string | number | null | undefined;
};

// Columns Hook - Logic corrected!
const useColumns = <T extends Record<string, unknown>>(
  initialColumns: TColumn<T>[],
) => {
  const [columns, setColumns] = useState<TColumn<T>[]>(initialColumns || []);
  const [selected, setSelected] = useState<string[]>(
    initialColumns?.map((c) => c?.name.toString()) || [],
  );

  const toggler = (column: TColumn<T>) => {
    if (selected?.includes(column?.name.toString())) {
      setSelected(selected?.filter((c) => c !== column?.name.toString()));
    } else {
      setSelected([...selected, column?.name.toString()]);
    }
  };

  useMemo(() => {
    if (!(selected?.length > 0)) {
      return;
    }

    const processedColumns = columns?.filter((column) =>
      selected?.includes(column?.name.toString()),
    );

    setColumns(processedColumns);
  }, [columns, selected]);

  return { columns, selected, setSelected, toggler };
};

// Searching Hook - Logic corrected!
const useSearching = <T extends Record<string, unknown>>(
  data: T[],
  columns: TColumn<T>[],
  search?: string,
  isSearchProcessed: boolean = false,
) => {
  const filteredData = useMemo(() => {
    if (isSearchProcessed) {
      return data;
    }

    if (!search || search.trim() === "") {
      return data;
    }

    const checkIsSearchable = (field: keyof T) => {
      return columns.some(
        (column) => column.field === field && column.isSearchable,
      );
    };

    const searchLower = search.toLowerCase();

    return data.filter((item) => {
      return Object.entries(item).some(([key, value]) => {
        if (
          (typeof value === "string" || typeof value === "number") &&
          checkIsSearchable(key as keyof T)
        ) {
          return value.toString().toLowerCase().includes(searchLower);
        }
        return false;
      });
    });
  }, [data, columns, search, isSearchProcessed]);

  return filteredData;
};

// Pagination Hook - Logic corrected!
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

// Sorting Hook - Logic corrected!
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
  index,
  row,
  cell,
  formatter,
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
    return <>{formatter({ cell: cell, row, index: index })}</>;
  }

  return <>{renderValue(cell)}</>;
};

// DataTable Component
const DataTable = <T extends Record<string, unknown>>({
  title,
  slot,
  columns,
  data,
  config,
  state,
}: TDataTableProps<T>) => {
  const {
    isSearchProcessed = false,
    isSortProcessed = false,
    isPaginationProcessed = false,
    isViewSearch = true,
    isViewSort = true,
    isViewPagination = true,
  } = config || {};

  const {
    search,
    sort,
    page,
    limit,
    onSearchChange,
    onSortChange,
    onPageChange,
    onLimitChange,
  } = useQueryState({
    search: state?.search,
    sort: state?.sort,
    page: state?.page,
    limit: state?.limit,
    onSearchChange: state?.onSearchChange,
    onSortChange: state?.onSortChange,
    onPageChange: state?.onPageChange,
    onLimitChange: state?.onLimitChange,
  });

  // Calculate pagination values
  const currentSearch = search || "";
  const currentSort = sort || "";
  const currentPage = page || 1;
  const currentLimit = limit || 10;

  //  Apply searching
  const searchedData = useSearching(
    data,
    columns,
    currentSearch,
    isSearchProcessed,
  );

  // Apply sorting
  const sortedData = useSorting(searchedData, currentSort, isSortProcessed);

  // Determine total count based on processing type
  const totalCount = useMemo(() => {
    if (isPaginationProcessed && typeof state?.total === "number") {
      return state?.total;
    } else {
      return sortedData.length;
    }
  }, [isPaginationProcessed, state?.total, sortedData.length]);

  // Apply pagination
  const paginatedData = usePagination(
    sortedData,
    currentPage,
    currentLimit,
    isPaginationProcessed,
  );

  const getFieldValue = useCallback((row: T, field: keyof T): T[keyof T] => {
    return row?.[field];
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

  // Search handler
  const handleSearchChange = debounce((value: string | null) => {
    onSearchChange(value || "");
  }, 500);

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

  const { columns: processedColumns, selected, toggler } = useColumns(columns);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap items-center justify-between">
        {title && (
          <div className="flex flex-1 items-center">
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>
        )}
        <div className="flex flex-1 items-center gap-4">
          {isViewSearch && (
            <div className="flex-1">
              <FormControl
                className="w-full"
                as="input"
                type="search"
                onChange={(e) => handleSearchChange(e.target.value || null)}
                defaultValue={currentSearch}
                placeholder="Search"
              />
            </div>
          )}
          {slot}
          <div className="flex h-10 items-center rounded-md border px-4">
            <Dropdown>
              <Dropdown.Trigger variant={"none"} size={"none"}>
                <span>Columns</span>
              </Dropdown.Trigger>
              <Dropdown.Content>
                <ul className="space-y-1">
                  {columns?.map((column) => (
                    <li
                      className=""
                      key={column.name}
                      onSelect={() => toggler(column)}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selected?.includes(column?.name.toString())}
                        />
                        <span>{column.name}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </Dropdown.Content>
            </Dropdown>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto rounded-md border px-4">
        <Table className="w-full">
          <Table.Header>
            <Table.Row>
              {processedColumns?.map((head, index) => (
                <Table.Head
                  key={`header-${head.field as string}-${index}`}
                  style={head.style}
                >
                  {head.isSortable && isViewSort ? (
                    <button
                      className="flex items-center gap-2"
                      onClick={() => handleSortClick(head.field as string)}
                      type="button"
                    >
                      <div>
                        {head.head ? head.head({ head: head }) : head.name}
                      </div>
                      {getSortIcon(head.field as string, currentSort)}
                    </button>
                  ) : (
                    <>{head.head ? head.head({ head: head }) : head.name}</>
                  )}
                </Table.Head>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {paginatedData.length === 0 ? (
              <Table.Row>
                <Table.Cell
                  colSpan={columns.length}
                  className="text-muted-foreground py-8 text-center"
                >
                  No data available
                </Table.Cell>
              </Table.Row>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <Table.Row key={`row-${rowIndex}`}>
                  {columns.map((head, cellIndex) => (
                    <Table.Cell
                      key={`cell-${rowIndex}-${cellIndex}`}
                      style={head.style}
                    >
                      <CellContent
                        index={rowIndex}
                        row={row}
                        cell={getFieldValue(row, head.field)}
                        formatter={head.cell}
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

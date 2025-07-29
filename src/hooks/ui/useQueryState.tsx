import { useEffect, useState } from "react";

export type QueryState = {
  sort: string;
  page: number;
  limit: number;
  onSortChange: (sort: string) => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
};

type UseQueryStateProps = {
  sort?: string;
  page?: number;
  limit?: number;
  onSortChange?: (sort: string) => void;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
};

const DEFAULT_QUERY = {
  sort: "",
  page: 1,
  limit: 10,
};

export const useQueryState = ({
  sort: sortProp,
  page: pageProp,
  limit: limitProp,
  onSortChange: onSortChangeProp,
  onPageChange: onPageChangeProp,
  onLimitChange: onLimitChangeProp,
}: UseQueryStateProps = {}): QueryState => {
  const [sort, setSort] = useState(sortProp ?? DEFAULT_QUERY.sort);
  const [page, setPage] = useState(pageProp ?? DEFAULT_QUERY.page);
  const [limit, setLimit] = useState(limitProp ?? DEFAULT_QUERY.limit);

  const handleSortChange = (value: string) => {
    setSort(value);
    onSortChangeProp?.(value);
  };

  const handlePageChange = (value: number) => {
    setPage(value);
    onPageChangeProp?.(value);
  };

  const handleLimitChange = (value: number) => {
    setLimit(value);
    onLimitChangeProp?.(value);
  };

  useEffect(() => {
    if (sortProp !== undefined && sortProp !== sort) {
      setSort(sortProp);
    }
  }, [sortProp, sort]);

  useEffect(() => {
    if (pageProp !== undefined && pageProp !== page) {
      setPage(pageProp);
    }
  }, [pageProp, page]);

  useEffect(() => {
    if (limitProp !== undefined && limitProp !== limit) {
      setLimit(limitProp);
    }
  }, [limitProp, limit]);

  return {
    sort,
    page,
    limit,
    onSortChange: handleSortChange,
    onPageChange: handlePageChange,
    onLimitChange: handleLimitChange,
  };
};

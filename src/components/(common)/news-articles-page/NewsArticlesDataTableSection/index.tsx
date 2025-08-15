import { Button } from "@/components/ui/Button";
import type { TColumn, TState } from "@/components/ui/DataTable";
import DataTable from "@/components/ui/DataTable";
import { Switch } from "@/components/ui/Switch";
import { cn } from "@/lib/utils";
import type { TNews, TStatus } from "@/types/news.type";
import type { TBreadcrumbs } from "@/types/route-menu.type";
import { Edit, Eye, Trash } from "lucide-react";
import React from "react";
import { Link } from "react-router";

type NewsArticlesDataTableSectionProps = {
  data?: TNews[];
  breadcrumbs: TBreadcrumbs[];
  isLoading: boolean;
  isError: boolean;
  onDelete: (row: TNews) => void;
  onToggleFeatured: (row: TNews) => void;
  onToggleTopFeatured: (row: TNews) => void;
  state: TState;
};

const NewsArticlesDataTableSection: React.FC<
  NewsArticlesDataTableSectionProps
> = ({
  data = [],
  breadcrumbs,
  isLoading,
  isError,
  onDelete,
  onToggleFeatured,
  onToggleTopFeatured,
  state,
}) => {
  const columns: TColumn<TNews>[] = [
    { name: "Sequence", field: "sequence", isSortable: true },
    { name: "Title", field: "title", isSortable: true, isSearchable: true },
    { name: "Slug", field: "slug", isSortable: true },
    {
      name: "Category",
      field: "category",
      cell: ({ cell }) => (
        <span>{(cell as TNews["category"])?.name?.toString()}</span>
      ),
    },
    {
      name: "Author",
      field: "author",
      cell: ({ cell }) => (
        <span>{(cell as TNews["author"])?.name?.toString()}</span>
      ),
    },
    {
      name: "Layout",
      field: "layout",
      isSortable: true,
      cell: ({ cell }) => <span>{cell?.toString()}</span>,
    },
    {
      name: "Status",
      field: "status",
      isSortable: true,
      cell: ({ cell }) => {
        const statusStyles = {
          draft: "bg-gray-100 text-gray-800",
          pending: "bg-yellow-100 text-yellow-800",
          published: "bg-green-100 text-green-800",
          archived: "bg-red-100 text-red-800",
        };

        return (
          <span
            className={cn(
              "rounded-full px-2 py-1 text-xs font-medium",
              statusStyles[cell as TStatus],
            )}
          >
            {cell?.toString()}
          </span>
        );
      },
    },
    {
      name: "Top Featured",
      field: "is_top_featured",
      isSortable: true,
      cell: ({ cell, row }) => (
        <div>
          <Switch
            disabled={isLoading}
            onChange={() => onToggleTopFeatured(row)}
            checked={cell === true}
          />
        </div>
      ),
    },
    {
      name: "Featured",
      field: "is_featured",
      isSortable: true,
      cell: ({ cell, row }) => (
        <div>
          <Switch
            disabled={isLoading}
            onChange={() => onToggleFeatured(row)}
            checked={cell === true}
          />
        </div>
      ),
    },
    {
      name: "Published At",
      field: "published_at",
      isSortable: true,
      cell: ({ cell }) => (
        <div>
          {new Date((cell as string) || "").toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
      ),
    },
    {
      style: { width: "150px", textAlign: "center" },
      name: "Actions",
      field: "_id",
      cell: ({ row }) => (
        <div className="flex w-full items-center justify-center gap-2">
          <Button
            asChild={true}
            className="[--accent:green]"
            size={"sm"}
            variant="outline"
            shape={"icon"}
          >
            <Link
              to={`/news-articles/${row._id}`}
              state={{
                category: row,
                breadcrumbs: [
                  ...(breadcrumbs || []),
                  { name: row.title, path: `/news-articles/${row._id}` },
                ],
              }}
            >
              <Eye className="size-4" />
            </Link>
          </Button>
          <Button asChild={true} size={"sm"} variant="outline" shape={"icon"}>
            <Link
              to={`/news-articles/edit/${row._id}`}
              state={{
                category: row,
                breadcrumbs: [
                  ...(breadcrumbs || []),
                  { name: row.title, path: `/news-articles/${row._id}` },
                ],
              }}
            >
              <Edit className="size-4" />
            </Link>
          </Button>
          <Button
            onClick={() => onDelete(row)}
            className="[--accent:red]"
            size={"sm"}
            variant="outline"
            shape={"icon"}
          >
            <Trash className="size-4" />
          </Button>
        </div>
      ),
    },
  ];
  return (
    <div>
      <DataTable
        status={isLoading ? "loading" : isError ? "error" : "success"}
        columns={columns}
        data={data || []}
        config={{
          isSearchProcessed: true,
          isSortProcessed: true,
          isPaginationProcessed: true,
        }}
        state={state}
      />
    </div>
  );
};

export default NewsArticlesDataTableSection;

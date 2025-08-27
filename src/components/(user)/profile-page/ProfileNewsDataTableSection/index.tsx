import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { TColumn, TState } from "@/components/ui/DataTable";
import DataTable from "@/components/ui/DataTable";
import { Switch } from "@/components/ui/Switch";
import { URLS } from "@/config";
import useUser from "@/hooks/states/useUser";
import { cn } from "@/lib/utils";
import type { TNews, TStatus } from "@/types/news.type";
import type { TBreadcrumbs } from "@/types/route-menu.type";
import { Edit, Eye, Tag, Trash, User } from "lucide-react";
import React from "react";
import { Link } from "react-router";

type NewsArticlesDataTableSectionProps = {
  data?: TNews[];
  breadcrumbs: TBreadcrumbs[];
  isLoading: boolean;
  isError: boolean;
  onDelete: (row: TNews) => void;
  onToggleFeatured: (row: TNews) => void;
  onToggleNewsHeadline: (row: TNews) => void;
  onToggleNewsBreak: (row: TNews) => void;
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
  onToggleNewsHeadline,
  onToggleNewsBreak,
  state,
}) => {
  const { user } = useUser();
  const { info } = user || {};

  const columns: TColumn<TNews>[] = [
    {
      name: "News",
      field: "_id",
      isSortable: true,
      isSearchable: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="aspect-square h-20 flex-shrink-0 overflow-hidden rounded">
            {row.thumbnail && (
              <img
                className="size-full object-cover"
                src={URLS.news.thumbnail + "/" + row.thumbnail}
                alt=""
              />
            )}
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="text-base font-bold">{row.title}</h3>
            <p className="text-sm">{row.slug}</p>
            <div className="flex items-center">
              <Badge className="bg-muted text-foreground flex w-fit items-center gap-2 px-2 py-1 text-xs">
                <Tag className="size-4" />
                <span className="leading-none">{row?.category?.name}</span>
              </Badge>
              <Badge className="bg-muted text-foreground flex w-fit items-center gap-2 px-2 py-1 text-xs">
                <User className="size-4" />
                <span className="leading-none">{row?.author?.name}</span>
              </Badge>
            </div>
          </div>
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
      name: "Layout",
      field: "layout",
      isSortable: true,
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
      name: "News Headline",
      field: "is_news_headline",
      isSortable: true,
      cell: ({ cell, row }) => (
        <div>
          <Switch
            disabled={isLoading}
            onChange={() => onToggleNewsHeadline(row)}
            checked={cell === true}
          />
        </div>
      ),
    },
    {
      name: "News Break",
      field: "is_news_break",
      isSortable: true,
      cell: ({ cell, row }) => (
        <div>
          <Switch
            disabled={isLoading}
            onChange={() => onToggleNewsBreak(row)}
            checked={cell === true}
          />
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
              to={
                info?.role !== "admin" || row.author?._id !== info?._id
                  ? "#"
                  : `/news-articles/${row._id}`
              }
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

          {(["supper-admin", "admin", "editor"].includes(info?.role || "") ||
            row.author?._id === info?._id) && (
            <Button
              disabled={info?.role !== "admin" || row.author?._id !== info?._id}
              asChild={true}
              size={"sm"}
              variant="outline"
              shape={"icon"}
            >
              <Link
                to={
                  info?.role !== "admin" || row.author?._id !== info?._id
                    ? "#"
                    : `/news-articles/edit/${row._id}`
                }
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
          )}

          {(["supper-admin", "admin"].includes(info?.role || "") ||
            row.author?._id === info?._id) && (
            <Button
              disabled={info?.role !== "admin" || row.author?._id !== info?._id}
              onClick={() => onDelete(row)}
              className="[--accent:red]"
              size={"sm"}
              variant="outline"
              shape={"icon"}
            >
              <Trash className="size-4" />
            </Button>
          )}
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

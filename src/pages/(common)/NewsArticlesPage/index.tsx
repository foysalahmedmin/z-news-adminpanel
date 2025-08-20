import NewsArticlesDataTableSection from "@/components/(common)/news-articles-page/NewsArticlesDataTableSection";
import PageHeader from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Dropdown } from "@/components/ui/Dropdown";
import { FormControl } from "@/components/ui/FormControl";
import useMenu from "@/hooks/states/useMenu";
import useAlert from "@/hooks/ui/useAlert";
import { fetchCategoriesTree } from "@/services/category.service";
import { deleteNews, fetchBulkNews, updateNews } from "@/services/news.service";
import { fetchUsers } from "@/services/user.service";
import type { TNews, TUpdateNewsPayload } from "@/types/news.type";
import type { ErrorResponse } from "@/types/response.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Calendar, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Link } from "react-router";
import { toast } from "react-toastify";

const NewsArticlesPage = () => {
  // Hooks and state initialization
  const { activeBreadcrumbs } = useMenu();
  const queryClient = useQueryClient();
  const confirm = useAlert();

  // Filtering and pagination state
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("-published_at");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState("");
  const [featured, setFeatured] = useState("");
  const [publishedAtGte, setPublishedAtGte] = useState("");
  const [publishedAtLte, setPublishedAtLte] = useState("");

  // API mutations
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: TUpdateNewsPayload;
    }) => updateNews(id, payload),
    onSuccess: (data) => {
      toast.success(data?.message || "News updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["news_articles"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || "Failed to update news");
      console.error("Update news error:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNews(id),
    onSuccess: (data) => {
      toast.success(data?.message || "News deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["news_articles"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || "Failed to delete news");
      console.error("Delete news error:", error);
    },
  });

  // API queries
  const newsQuery = useQuery({
    queryKey: [
      "bulkNews",
      {
        sort,
        search,
        page,
        limit,
        category,
        publishedAtGte,
        publishedAtLte,
        author,
        status,
        featured,
      },
    ],
    queryFn: () =>
      fetchBulkNews({
        page,
        limit,
        ...(category && { category }),
        sort: sort || "-published_at",
        ...(search && { search }),
        ...(publishedAtGte && { published_at_gte: publishedAtGte }),
        ...(publishedAtLte && { published_at_lte: publishedAtLte }),
        ...(author && { author }),
        ...(status && { status }),
        ...(featured && {
          is_featured: featured === "featured" ? true : false,
        }),
      }),
  });

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategoriesTree({ sort: "sequence" }),
  });

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: () =>
      fetchUsers({
        or: [
          {
            role: "admin",
          },
          {
            role: "author",
          },
        ],
      }),
  });

  // Derived data
  const selectedRange = useMemo<DateRange | undefined>(() => {
    if (publishedAtGte && publishedAtLte) {
      return { from: new Date(publishedAtGte), to: new Date(publishedAtLte) };
    } else if (publishedAtGte) {
      return { from: new Date(publishedAtGte), to: undefined };
    }
    return undefined;
  }, [publishedAtGte, publishedAtLte]);

  // Event handlers
  const handleToggleFeatured = useCallback(
    (news: TNews) => {
      updateMutation.mutate({
        id: news._id,
        payload: { is_featured: !news.is_featured },
      });
    },
    [updateMutation],
  );

  const handleDelete = useCallback(
    async (news: TNews) => {
      const ok = await confirm({
        title: "Delete news",
        message: "Are you sure you want to delete this news?",
        confirmText: "Delete",
        cancelText: "Cancel",
      });
      if (ok) {
        deleteMutation.mutate(news._id);
      }
    },
    [confirm, deleteMutation],
  );

  function formatYMD(date?: Date) {
    if (!date) return "";
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  const handleDateRangeSelect = useCallback((range: DateRange | undefined) => {
    if (range?.from) {
      setPublishedAtGte(formatYMD(range?.from));
      setPublishedAtLte(formatYMD(range?.to));
    } else {
      setPublishedAtGte("");
      setPublishedAtLte("");
    }
  }, []);

  const clearDateRange = useCallback(() => {
    setPublishedAtGte("");
    setPublishedAtLte("");
  }, []);

  const formatDateRange = useCallback(() => {
    if (!selectedRange?.from) return "Select date range";

    const formatOptions: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };

    const fromDate = selectedRange.from.toLocaleDateString(
      "en-US",
      formatOptions,
    );

    if (!selectedRange.to) return `${fromDate} to`;
    const toDate = selectedRange.to.toLocaleDateString("en-US", formatOptions);

    return `${fromDate} - ${toDate}`;
  }, [selectedRange]);

  const setPresetRange = useCallback((days: number) => {
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - days);

    setPublishedAtGte(startDate.toISOString().split("T")[0]);
    setPublishedAtLte(today.toISOString().split("T")[0]);
  }, []);

  return (
    <main className="space-y-6">
      <PageHeader
        name="News Articles"
        slot={
          <Button asChild>
            <Link className="flex h-full items-center" to="/news-articles/add">
              Add New
            </Link>
          </Button>
        }
      />

      <Card>
        <Card.Content>
          <div className="mb-6 grid w-full gap-4 md:grid-cols-2">
            {/* Date Range Picker */}
            <Dropdown className="w-full md:grid-cols-2">
              <Dropdown.Trigger
                isAnimation={false}
                className="w-full active:scale-100"
                variant="none"
                size="none"
              >
                <div className="flex h-full w-full min-w-[200px] items-center gap-2 rounded-md border px-3 py-2 transition-colors">
                  <Calendar size={16} />
                  <span className="text-sm">{formatDateRange()}</span>
                  {selectedRange?.from && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        clearDateRange();
                      }}
                      className="ml-auto text-gray-400 hover:text-gray-600"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </Dropdown.Trigger>

              <Dropdown.Content>
                <div className="bg-card text-card-foreground absolute top-full left-0 z-50 mt-2 rounded-lg border p-4 py-5 shadow-md">
                  {/* Quick Presets */}
                  <div className="mb-4 flex flex-wrap gap-2 border-b pb-4">
                    <button
                      onClick={() => setPresetRange(7)}
                      className="bg-foreground/10 text-foreground hover:bg-foreground/5 flex-1 cursor-pointer rounded py-1 text-xs transition-colors"
                    >
                      Last 7 days
                    </button>
                    <button
                      onClick={() => setPresetRange(30)}
                      className="bg-foreground/10 text-foreground hover:bg-foreground/5 flex-1 cursor-pointer rounded py-1 text-xs transition-colors"
                    >
                      Last 30 days
                    </button>
                    <button
                      onClick={() => setPresetRange(90)}
                      className="bg-foreground/10 text-foreground hover:bg-foreground/5 flex-1 cursor-pointer rounded py-1 text-xs transition-colors"
                    >
                      Last 90 days
                    </button>
                  </div>

                  {/* Calendar */}
                  <DayPicker
                    mode="range"
                    selected={selectedRange}
                    onSelect={handleDateRangeSelect}
                    disabled={{ after: new Date() }}
                    className="w-full"
                    footer={
                      selectedRange?.from && (
                        <div className="bg-muted mt-4 rounded p-2 text-sm">
                          <strong>Selected:</strong> {formatDateRange()}
                        </div>
                      )
                    }
                  />
                </div>
              </Dropdown.Content>
            </Dropdown>

            {/* Category Filter */}
            <FormControl
              as="select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All categories</option>
              {categoriesQuery.data?.data?.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </FormControl>

            {/* Author Filter */}
            <FormControl
              as="select"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            >
              <option value="">All authors</option>
              {usersQuery.data?.data?.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </FormControl>

            {/* Status Filter */}
            <FormControl
              as="select"
              value={status}
              onChange={(e) => setStatus(e.target.value || "")}
            >
              <option value="">All statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </FormControl>

            {/* Featured Filter */}
            <FormControl
              as="select"
              value={featured}
              onChange={(e) => setFeatured(e.target.value || "")}
            >
              <option value="">All</option>
              <option value="featured">Featured</option>
              <option value="not-featured">Not Featured</option>
            </FormControl>
          </div>
          <NewsArticlesDataTableSection
            data={newsQuery.data?.data || []}
            breadcrumbs={activeBreadcrumbs || []}
            isLoading={newsQuery.isLoading}
            isError={newsQuery.isError}
            onDelete={handleDelete}
            onToggleFeatured={handleToggleFeatured}
            state={{
              total: newsQuery.data?.meta?.total || 0,
              page,
              setPage,
              limit,
              setLimit,
              search,
              setSearch,
              sort,
              setSort,
            }}
          />
        </Card.Content>
      </Card>
    </main>
  );
};

export default NewsArticlesPage;

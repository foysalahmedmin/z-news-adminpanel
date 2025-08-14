import NewsArticlesDataTableSection from "@/components/(common)/news-articles-page/NewsArticlesDataTableSection";
import PageHeader from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import useMenu from "@/hooks/states/useMenu";
import useAlert from "@/hooks/ui/useAlert";
import { deleteNews, fetchBulkNews, updateNews } from "@/services/news.service";
import type { TNews, TUpdateNewsPayload } from "@/types/news.type";
import type { ErrorResponse } from "@/types/response.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "react-toastify";

const NewsArticlesPage = () => {
  const { activeBreadcrumbs } = useMenu();
  const queryClient = useQueryClient();
  const confirm = useAlert();

  const update_mutation = useMutation({
    mutationFn: ({
      _id,
      payload,
    }: {
      _id: string;
      payload: TUpdateNewsPayload;
    }) => updateNews(_id, payload),
    onSuccess: (data) => {
      toast.success(data?.message || "Category updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || "Failed to update category");
      console.error("Update Category Error:", error);
    },
  });

  const delete_mutation = useMutation({
    mutationFn: (_id: string) => deleteNews(_id),
    onSuccess: (data) => {
      toast.success(data?.message || "Category deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || "Failed to delete category");
      console.error("Delete Category Error:", error);
    },
  });

  const onToggleFeatured = async (category: TNews) => {
    const payload = { is_featured: !category.is_featured };
    update_mutation.mutate({ _id: category._id, payload });
  };

  const onDelete = async (category: TNews) => {
    const ok = await confirm({
      title: "Delete Category",
      message: "Are you sure you want to delete this category?",
      confirmText: "Delete",
      cancelText: "Cancel",
    });
    if (ok) {
      delete_mutation.mutate(category._id);
    }
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchBulkNews({ sort: "sequence" }),
  });

  return (
    <main className="space-y-6">
      <PageHeader name="News Articles" slot={<Button>Add Category</Button>} />
      <Card>
        <Card.Content>
          <NewsArticlesDataTableSection
            data={data?.data || []}
            breadcrumbs={activeBreadcrumbs || []}
            isLoading={isLoading}
            isError={isError}
            onDelete={onDelete}
            onToggleFeatured={onToggleFeatured}
          />
        </Card.Content>
      </Card>
    </main>
  );
};

export default NewsArticlesPage;

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { z } from "zod";

import ArticleDetails from "@/components/(common)/news-articles-add-page/ArticleDetails";
import CategoriesAndTags from "@/components/(common)/news-articles-add-page/CategoriesAndTags";
import ContentEditor from "@/components/(common)/news-articles-add-page/ContentEditor";
import PublishSettings from "@/components/(common)/news-articles-add-page/PublishSettings";
import SEOSection from "@/components/(common)/news-articles-add-page/SEOSection";
import Loader from "@/components/partials/Loader";
import PageHeader from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/Button";
import useUser from "@/hooks/states/useUser";
import { fetchNews, updateNews, updateSelfNews } from "@/services/news.service";
import type { TUpdateNewsPayload } from "@/types/news.type";
import { ArrowLeft, Eye } from "lucide-react";
import { useEffect } from "react";

// Updated schema with proper File types and consistent defaults
const newsSchema = z.object({
  sequence: z.coerce.number().optional(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  caption: z.string().optional(),
  description: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  thumbnail: z
    .union([z.instanceof(File), z.string()])
    .nullable()
    .optional(),
  youtube: z.string().optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().min(1, "Category is required"),
  writer: z.string().optional(),
  layout: z.enum(["default", "standard", "featured", "minimal"]).optional(),
  status: z.enum(["draft", "pending", "published", "archived"]).optional(),
  is_featured: z.boolean(),
  seo: z
    .object({
      image: z
        .union([z.instanceof(File), z.string()])
        .nullable()
        .optional(),
      title: z.string().optional(),
      description: z.string().optional(),
      keywords: z.array(z.string()).optional(),
    })
    .optional(),
  published_at: z.date().optional(),
  expired_at: z.date().optional(),
  is_news_headline: z.coerce.boolean().optional(),
  is_news_break: z.coerce.boolean().optional(),
});

export type NewsFormData = z.infer<typeof newsSchema>;

const NewsArticlesUpdatePage = () => {
  const { id } = useParams();
  const { user } = useUser();
  const { info } = user || {};

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  if (!info?._id) {
    navigate("/auth/signin");
  }

  // Fetch existing news data
  const { data: newsData, isLoading } = useQuery({
    queryKey: ["news", id],
    queryFn: () => fetchNews(id!),
    enabled: !!id,
  });

  const methods = useForm<NewsFormData>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      content: "",
      category: "",
      status: "draft",
      layout: "default",
      is_featured: false,
      published_at: new Date(),
      tags: [],
      seo: {
        title: "",
        description: "",
        keywords: [],
      },
    },
  });

  // Reset form with fetched data
  useEffect(() => {
    if (newsData) {
      const { data } = newsData;
      methods.reset({
        sequence: data?.sequence,
        title: data?.title,
        slug: data?.slug,
        caption: data?.caption,
        description: data?.description,
        content: data?.content,
        thumbnail: data?.thumbnail,
        youtube: data?.youtube,
        tags: data?.tags,
        category: data?.category?._id,
        writer: data?.writer,
        layout: data?.layout,
        status: data?.status,
        is_featured: data?.is_featured,
        seo: data?.seo,
        published_at: data?.published_at
          ? new Date(data?.published_at)
          : undefined,
        expired_at: data?.expired_at ? new Date(data?.expired_at) : undefined,
        is_news_headline: data?.is_news_headline,
        is_news_break: data?.is_news_break,
      });
    }
  }, [newsData, methods]);

  // TanStack Query mutation for update
  const updateNewsMutation = useMutation({
    mutationFn: (data: TUpdateNewsPayload) =>
      ["super-admin", "admin"].includes(info?.role || "")
        ? updateNews(id!, data)
        : updateSelfNews(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news", id] });
      navigate("/news-articles");
    },
    onError: (error) => {
      console.error("Error updating news:", error);
      // Add toast notification here if needed
    },
  });

  const onSubmit = async (data: NewsFormData) => {
    try {
      updateNewsMutation.mutate(data);
    } catch (error) {
      console.error("Error updating news:", error);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  const news = newsData?.data;

  return (
    <main className="space-y-6">
      <PageHeader
        name="Update News Article"
        breadcrumbs={[
          { name: "News Articles", path: "/news-articles" },
          { name: "Update News Article" },
        ]}
        slot={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button onClick={() => navigate(`/news-articles/${news?._id}`)}>
              <Eye className="h-4 w-4" />
              View
            </Button>
          </div>
        }
      />

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6">
            <ArticleDetails />
            <ContentEditor />
            <SEOSection />
            <CategoriesAndTags />
            <PublishSettings />
          </div>

          <hr />

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              size={"lg"}
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size={"lg"}
              isLoading={updateNewsMutation.isPending}
              disabled={updateNewsMutation.isPending}
            >
              {updateNewsMutation.isPending ? "Updating..." : "Update Article"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </main>
  );
};

export default NewsArticlesUpdatePage;

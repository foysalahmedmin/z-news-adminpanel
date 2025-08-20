import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import ArticleDetails from "@/components/(common)/news-articles-add-page/ArticleDetails";
import CategoriesAndTags from "@/components/(common)/news-articles-add-page/CategoriesAndTags";
import ContentEditor from "@/components/(common)/news-articles-add-page/ContentEditor";
import PublishSettings from "@/components/(common)/news-articles-add-page/PublishSettings";
import SEOSection from "@/components/(common)/news-articles-add-page/SEOSection";
import PageHeader from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/Button";
import useUser from "@/hooks/states/useUser";
import { createNews } from "@/services/news.service";
import type { TCreateNewsPayload } from "@/types/news.type";
import { useNavigate } from "react-router";

// Updated schema with proper File types and consistent defaults
export const newsSchema = z.object({
  sequence: z.coerce.number().optional(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  caption: z.string().optional(),
  description: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  thumbnail: z.instanceof(File).nullable().optional(),
  images: z.array(z.instanceof(File)).nullable().optional(),
  video: z.instanceof(File).nullable().optional(),
  youtube: z.string().optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().min(1, "Category is required"),
  author: z.string().min(1, "Author is required"),
  writer: z.string().optional(),
  layout: z.enum(["default", "standard", "featured", "minimal"]).optional(),
  status: z.enum(["draft", "published"]).optional(),
  is_featured: z.boolean(),
  is_premium: z.boolean(),
  seo: z
    .object({
      image: z.instanceof(File).nullable().optional(),
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

const NewsArticlesAddPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  if (!user.info?._id) {
    navigate("/auth/signin");
  }

  const methods = useForm<NewsFormData>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      content: "",
      category: "",
      author: user.info?._id,
      status: "draft",
      layout: "default",
      is_featured: false,
      is_premium: false,
      published_at: new Date(),
      tags: [],
      seo: {
        title: "",
        description: "",
        keywords: [],
      },
    },
  });

  // TanStack Query mutation
  const createNewsMutation = useMutation({
    mutationFn: (data: TCreateNewsPayload) => createNews(data),
    onSuccess: () => {
      navigate("/news-articles");
    },
    onError: (error) => {
      console.error("Error creating news:", error);
      // Add toast notification here if needed
    },
  });

  const onSubmit = async (data: NewsFormData) => {
    try {
      const payload: TCreateNewsPayload = {
        ...data,
      };

      createNewsMutation.mutate(payload);
    } catch (error) {
      console.error("Error creating news:", error);
    }
  };

  return (
    <main className="space-y-6">
      <PageHeader
        name="Add News Article"
        breadcrumbs={[
          { name: "News Articles", path: "/news-articles" },
          { name: "Add News Article" },
        ]}
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
              isLoading={createNewsMutation.isPending}
              disabled={createNewsMutation.isPending}
            >
              {createNewsMutation.isPending ? "Creating..." : "Create Article"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </main>
  );
};

export default NewsArticlesAddPage;

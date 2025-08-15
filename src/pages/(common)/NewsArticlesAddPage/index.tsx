"use client";

import type { BlockNoteEditor } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import PageHeader from "@/components/sections/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormControl } from "@/components/ui/FormControl";
import { Switch } from "@/components/ui/Switch";
import { cn } from "@/lib/utils";
import { createNews } from "@/services/news.service";
import type { TCreateNewsPayload, TStatus } from "@/types/news.type";
import { Plus, Upload, X } from "lucide-react";
import { useNavigate } from "react-router";

const newsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  summary: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  thumbnail: z.any().optional(),
  images: z.any().optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().min(1, "Category is required"),
  author: z.string().min(1, "Author is required"),
  layout: z.string().default("standard"),
  status: z.enum(["draft", "pending", "published", "archived"]),
  is_top_featured: z.boolean().default(false),
  is_featured: z.boolean().default(false),
  is_premium: z.boolean().default(false),
  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      keywords: z.array(z.string()).optional(),
    })
    .optional(),
  published_at: z.date().optional(),
  expired_at: z.date().optional(),
});

type NewsFormData = z.infer<typeof newsSchema>;

const NewsArticlesAddPage = () => {
  const navigate = useNavigate();
  const [editor, setEditor] = useState<BlockNoteEditor | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [seoKeywordInput, setSeoKeywordInput] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<NewsFormData>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      status: "draft",
      layout: "standard",
      is_top_featured: false,
      is_featured: false,
      is_premium: false,
      tags: [],
      seo: {
        keywords: [],
      },
    },
  });

  const watchedValues = watch();

  // BlockNote editor setup
  const blockNoteEditor = useCreateBlockNote({
    initialContent: [
      {
        type: "paragraph",
        content: "Start writing your article...",
      },
    ],
  });

  // TanStack Query mutation
  const createNewsMutation = useMutation({
    mutationFn: (data: Partial<TCreateNewsPayload>) => createNews(data),
    onSuccess: () => {
      navigate("/news-articles");
    },
    onError: (error) => {
      console.error("Error creating news:", error);
      // Add toast notification here if needed
    },
  });

  const onSubmit = async (data: NewsFormData) => {
    if (!blockNoteEditor) return;

    try {
      // Get HTML content from BlockNote editor
      const htmlContent = await blockNoteEditor.blocksToHTMLLossy(
        blockNoteEditor.document,
      );

      const payload: Partial<TCreateNewsPayload> = {
        ...data,
        content: htmlContent,
        sequence: Date.now(), // Generate sequence number
      };

      createNewsMutation.mutate(payload);
    } catch (error) {
      console.error("Error converting content:", error);
    }
  };

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setValue("title", title);
    setValue("slug", generateSlug(title));
  };

  const addTag = () => {
    if (tagInput.trim()) {
      const currentTags = watchedValues.tags || [];
      if (!currentTags.includes(tagInput.trim())) {
        setValue("tags", [...currentTags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = watchedValues.tags || [];
    setValue(
      "tags",
      currentTags.filter((tag) => tag !== tagToRemove),
    );
  };

  const addSeoKeyword = () => {
    if (seoKeywordInput.trim()) {
      const currentKeywords = watchedValues.seo?.keywords || [];
      if (!currentKeywords.includes(seoKeywordInput.trim())) {
        setValue("seo.keywords", [...currentKeywords, seoKeywordInput.trim()]);
      }
      setSeoKeywordInput("");
    }
  };

  const removeSeoKeyword = (keywordToRemove: string) => {
    const currentKeywords = watchedValues.seo?.keywords || [];
    setValue(
      "seo.keywords",
      currentKeywords.filter((keyword) => keyword !== keywordToRemove),
    );
  };

  return (
    <main className="container mx-auto p-6">
      <PageHeader
        name="Add News Article"
        breadcrumbs={[
          { name: "News Articles", path: "/news-articles" },
          { name: "Add News Article" },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <Card.Header>
                <Card.Title>Article Details</Card.Title>
              </Card.Header>
              <Card.Content className="space-y-4">
                <div>
                  <FormControl.Label htmlFor="title">Title *</FormControl.Label>
                  <FormControl
                    id="title"
                    {...register("title")}
                    onChange={handleTitleChange}
                    className={cn(errors.title && "border-destructive")}
                  />
                  {errors.title && (
                    <p className="text-destructive mt-1 text-sm">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div>
                  <FormControl.Label htmlFor="slug">Slug *</FormControl.Label>
                  <FormControl
                    id="slug"
                    {...register("slug")}
                    className={cn(errors.slug && "border-destructive")}
                  />
                  {errors.slug && (
                    <p className="text-destructive mt-1 text-sm">
                      {errors.slug.message}
                    </p>
                  )}
                </div>

                <div>
                  <FormControl.Label htmlFor="summary">
                    Summary
                  </FormControl.Label>
                  <FormControl id="summary" {...register("summary")} rows={3} />
                </div>

                <div>
                  <FormControl.Label htmlFor="author">
                    Author *
                  </FormControl.Label>
                  <FormControl
                    id="author"
                    {...register("author")}
                    className={cn(errors.author && "border-destructive")}
                  />
                  {errors.author && (
                    <p className="text-destructive mt-1 text-sm">
                      {errors.author.message}
                    </p>
                  )}
                </div>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header>
                <Card.Title>Content *</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="min-h-[400px] rounded-md border">
                  <BlockNoteView
                    editor={blockNoteEditor}
                    onChange={() => {
                      // Update form content when editor changes
                      blockNoteEditor
                        .blocksToHTMLLossy(blockNoteEditor.document)
                        .then((html) => {
                          setValue("content", html);
                        });
                    }}
                  />
                </div>
                {errors.content && (
                  <p className="text-destructive mt-1 text-sm">
                    {errors.content.message}
                  </p>
                )}
              </Card.Content>
            </Card>

            <Card>
              <Card.Header>
                <Card.Title>Media</Card.Title>
              </Card.Header>
              <Card.Content className="space-y-4">
                <div>
                  <FormControl.Label htmlFor="thumbnail">
                    Thumbnail
                  </FormControl.Label>
                  <div className="rounded-lg border-2 border-dashed p-4 text-center">
                    <Upload className="text-muted-foreground mx-auto h-12 w-12" />
                    <input
                      id="thumbnail"
                      type="file"
                      accept="image/*"
                      {...register("thumbnail")}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <FormControl.Label htmlFor="images">
                    Additional Images
                  </FormControl.Label>
                  <div className="rounded-lg border-2 border-dashed p-4 text-center">
                    <Upload className="text-muted-foreground mx-auto h-12 w-12" />
                    <input
                      id="images"
                      type="file"
                      accept="image/*"
                      multiple
                      {...register("images")}
                      className="mt-2"
                    />
                  </div>
                </div>
              </Card.Content>
            </Card>

            {/* SEO Section */}
            <Card>
              <Card.Header>
                <Card.Title>SEO Settings</Card.Title>
              </Card.Header>
              <Card.Content className="space-y-4">
                <div>
                  <FormControl.Label htmlFor="seo-title">
                    SEO Title
                  </FormControl.Label>
                  <FormControl id="seo-title" {...register("seo.title")} />
                </div>

                <div>
                  <FormControl.Label htmlFor="seo-description">
                    SEO Description
                  </FormControl.Label>
                  <FormControl
                    as={"textarea"}
                    id="seo-description"
                    {...register("seo.description")}
                    // rows={3}
                  />
                </div>

                <div>
                  <FormControl.Label>SEO Keywords</FormControl.Label>
                  <div className="mt-1 flex gap-2">
                    <FormControl
                      value={seoKeywordInput}
                      onChange={(e) => setSeoKeywordInput(e.target.value)}
                      placeholder="Add keyword"
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), addSeoKeyword())
                      }
                    />
                    <Button type="button" onClick={addSeoKeyword} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {watchedValues.seo?.keywords?.map((keyword, index) => (
                      <Badge key={index} className="flex items-center gap-1">
                        {keyword}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeSeoKeyword(keyword)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <Card.Header>
                <Card.Title>Publish Settings</Card.Title>
              </Card.Header>
              <Card.Content className="space-y-4">
                <div>
                  <FormControl.Label htmlFor="status">
                    Status *
                  </FormControl.Label>
                  <FormControl
                    as="select"
                    onChange={(e) =>
                      setValue("status", e.target.value as TStatus)
                    }
                  >
                    <option value="draft">Draft</option>
                    <option value="pending">Pending</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </FormControl>
                </div>

                <div>
                  <FormControl.Label htmlFor="published_at">
                    Publish Date
                  </FormControl.Label>
                  <FormControl
                    id="published_at"
                    type="datetime-local"
                    {...register("published_at", {
                      setValueAs: (value) =>
                        value ? new Date(value) : undefined,
                    })}
                  />
                </div>

                <div>
                  <FormControl.Label htmlFor="expired_at">
                    Expiry Date
                  </FormControl.Label>
                  <FormControl
                    id="expired_at"
                    type="datetime-local"
                    {...register("expired_at", {
                      setValueAs: (value) =>
                        value ? new Date(value) : undefined,
                    })}
                  />
                </div>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header>
                <Card.Title>Categories & Tags</Card.Title>
              </Card.Header>
              <Card.Content className="space-y-4">
                <div>
                  <FormControl.Label htmlFor="category">
                    Category *
                  </FormControl.Label>
                  <FormControl
                    as="select"
                    onChange={(e) => setValue("category", e.target.value)}
                  >
                    <option value="">Select a category</option>
                    {/* {categories?.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))} */}
                  </FormControl>
                  {errors.category && (
                    <p className="text-destructive mt-1 text-sm">
                      {errors.category.message}
                    </p>
                  )}
                </div>

                <div>
                  <FormControl.Label>Tags</FormControl.Label>
                  <div className="mt-1 flex gap-2">
                    <FormControl
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add tag"
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addTag())
                      }
                    />
                    <Button type="button" onClick={addTag} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {watchedValues.tags?.map((tag, index) => (
                      <Badge key={index} className="flex items-center gap-1">
                        {tag}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <FormControl.Label htmlFor="layout">Layout</FormControl.Label>
                  <FormControl
                    as="select"
                    onChange={(e) => setValue("layout", e.target.value)}
                  >
                    <option value="standard">Standard</option>
                    <option value="featured">Featured</option>
                    <option value="minimal">Minimal</option>
                  </FormControl>
                </div>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header>
                <Card.Title>Feature Settings</Card.Title>
              </Card.Header>
              <Card.Content className="space-y-4">
                <div className="flex items-center justify-between">
                  <FormControl.Label htmlFor="is_top_featured">
                    Top Featured
                  </FormControl.Label>
                  <Switch
                    id="is_top_featured"
                    checked={watchedValues.is_top_featured}
                    onChange={(checked) => setValue("is_top_featured", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <FormControl.Label htmlFor="is_featured">
                    Featured
                  </FormControl.Label>
                  <Switch
                    id="is_featured"
                    checked={watchedValues.is_featured}
                    onChange={(checked) => setValue("is_featured", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <FormControl.Label htmlFor="is_premium">
                    Premium
                  </FormControl.Label>
                  <Switch
                    id="is_premium"
                    checked={watchedValues.is_premium}
                    onChange={(checked) => setValue("is_premium", checked)}
                  />
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={createNewsMutation.isPending}>
            {createNewsMutation.isPending ? "Creating..." : "Create Article"}
          </Button>
        </div>
      </form>
    </main>
  );
};

export default NewsArticlesAddPage;

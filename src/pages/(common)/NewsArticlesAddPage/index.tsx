import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { z } from "zod";

import PageHeader from "@/components/sections/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormControl } from "@/components/ui/FormControl";
import { Switch } from "@/components/ui/Switch";
import { URLS } from "@/config";
import useSetting from "@/hooks/states/useSetting";
import useUser from "@/hooks/states/useUser";
import { cn } from "@/lib/utils";
import { fetchCategoriesTree } from "@/services/category.service";
import { createNews, uploadNewsFile } from "@/services/news.service";
import type { TCreateNewsPayload } from "@/types/news.type";
import { Plus, Upload, X } from "lucide-react";
import { useNavigate } from "react-router";

// Updated schema with proper File types and consistent defaults
const newsSchema = z.object({
  sequence: z.coerce.number().optional(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  caption: z.string().optional(),
  description: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  thumbnail: z.instanceof(File).nullable().optional(),
  images: z.array(z.instanceof(File)).nullable().optional(),
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

type NewsFormData = z.infer<typeof newsSchema>;

// ================ Reusable Components ================
interface ImageUploadProps {
  name: keyof NewsFormData | "seo.image";
  label: string;
  multiple?: boolean;
  className?: string;
}

const ImageUpload = ({
  name,
  label,
  multiple = false,
  className,
}: ImageUploadProps) => {
  const { setValue, watch } = useFormContext<NewsFormData>();
  const files = watch(name as any);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      if (multiple) {
        setValue(name as any, fileList);
      } else {
        setValue(name as any, fileList[0] || null);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files) {
      const fileList = Array.from(e.dataTransfer.files);
      if (multiple) {
        setValue(name as any, fileList);
      } else {
        setValue(name as any, fileList[0] || null);
      }
    }
  };

  const removeFile = (index?: number) => {
    if (multiple && Array.isArray(files)) {
      const newFiles = [...files];
      if (index !== undefined) {
        newFiles.splice(index, 1);
      }
      setValue(name as any, newFiles.length ? newFiles : null);
    } else {
      setValue(name as any, null);
    }
  };

  const generatePreviewUrl = (file: File) => {
    try {
      return URL.createObjectURL(file);
    } catch (error) {
      console.error("Error creating preview URL:", error);
      return "";
    }
  };

  return (
    <div className={cn("flex flex-col", className)}>
      <FormControl.Label>{label}</FormControl.Label>
      <div
        className={cn(
          "flex flex-1 cursor-pointer flex-col rounded-lg border-2 border-dashed p-4 text-center transition-colors",
          isDragging
            ? "border-primary bg-primary/10"
            : "border-muted-foreground",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          id={name}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
        />

        {!files || (multiple && (!files || files.length === 0)) ? (
          <label
            htmlFor={name}
            className="flex size-full flex-1 cursor-pointer items-center justify-center"
          >
            <div>
              <Upload className="text-muted-foreground mx-auto mb-2 h-12 w-12" />
              <p className="text-muted-foreground text-sm">
                Drag & drop images here or click to browse
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                {multiple ? "Multiple images allowed" : "Single image only"}
              </p>
            </div>
          </label>
        ) : (
          <div className="relative size-full flex-1">
            {multiple && Array.isArray(files) && (
              <div className="absolute inset-0 flex items-center justify-center">
                {files.map((file, index) => {
                  const previewUrl = generatePreviewUrl(file);
                  return previewUrl ? (
                    <div
                      key={index}
                      style={{
                        width: files.length > 1 ? "50%" : "100%",
                        height: files.length > 2 ? "50%" : "100%",
                      }}
                      className="group relative"
                    >
                      <img
                        src={previewUrl}
                        alt={`Preview ${index + 1}`}
                        className="size-full rounded-md object-cover"
                        onLoad={() => URL.revokeObjectURL(previewUrl)}
                      />
                      <button
                        type="button"
                        className="bg-destructive absolute top-1 right-1 rounded-full p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : null;
                })}
              </div>
            )}

            {!multiple &&
              files &&
              files instanceof File &&
              (() => {
                const previewUrl = generatePreviewUrl(files);
                return previewUrl ? (
                  <div className="absolute inset-0">
                    <div className="group relative size-full">
                      <img
                        src={previewUrl}
                        alt="Thumbnail preview"
                        className="size-full rounded-md object-cover"
                        onLoad={() => URL.revokeObjectURL(previewUrl)}
                      />
                      <button
                        type="button"
                        className="bg-destructive absolute top-1 right-1 rounded-full p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() => removeFile()}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ) : null;
              })()}
          </div>
        )}
      </div>
    </div>
  );
};

interface TagsInputProps {
  name: "tags" | "seo.keywords";
  label: string;
  placeholder: string;
}

const TagsInput = ({ name, label, placeholder }: TagsInputProps) => {
  const { setValue, watch } = useFormContext<NewsFormData>();
  const [inputValue, setInputValue] = useState("");
  const tags = (watch(name as any) as string[]) || [];

  const addTag = () => {
    if (inputValue.trim() && !tags.includes(inputValue.trim())) {
      setValue(name as any, [...tags, inputValue.trim()]);
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue(
      name as any,
      tags.filter((tag) => tag !== tagToRemove),
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div>
      <FormControl.Label>{label}</FormControl.Label>
      <div className="mt-1 flex gap-2">
        <FormControl
          value={inputValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInputValue(e.target.value)
          }
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
        />
        <Button type="button" onClick={addTag}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <Badge key={index} className="bg-muted-foreground/25 text-foreground">
            {tag}
            <X
              className="ml-1 h-3 w-3 cursor-pointer"
              onClick={() => removeTag(tag)}
            />
          </Badge>
        ))}
      </div>
    </div>
  );
};

// ================ Form Sections ================
const ArticleDetails = () => {
  const { user } = useUser();
  const {
    watch,
    register,
    setValue,
    formState: { errors },
  } = useFormContext<NewsFormData>();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setValue("title", title);
    setValue("slug", generateSlug(title));
  };

  const generateSlug = (title: string): string => {
    if (!title) return "";
    const base = `${title.trim().toLowerCase()}-${Date.now()}`;
    return base
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .trim();
  };

  return (
    <Card>
      <Card.Header className="border-b">
        <Card.Title>Article Details</Card.Title>
      </Card.Header>
      <Card.Content className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4 self-stretch">
            <div>
              <FormControl.Label htmlFor="title">Title *</FormControl.Label>
              <FormControl
                id="title"
                placeholder="Enter title"
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
                placeholder="Enter slug"
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
              <FormControl.Label htmlFor="description">
                Description
              </FormControl.Label>
              <FormControl
                as="textarea"
                className="h-20 py-2"
                placeholder="Enter description"
                id="description"
                {...register("description")}
              />
            </div>

            <div>
              <FormControl.Label htmlFor="caption">Caption</FormControl.Label>
              <FormControl
                id="caption"
                placeholder="Enter caption"
                value={watch("caption")}
                onChange={(e) => setValue("caption", e.target.value)}
              />
            </div>

            <div className="!mb-0">
              <FormControl.Label htmlFor="description">
                Writer
              </FormControl.Label>
              <FormControl
                placeholder="Enter writer"
                id="writer"
                {...register("writer")}
              />
            </div>

            <div className="hidden">
              <FormControl.Label
                className="text-muted-foreground"
                htmlFor="author"
              >
                Author *
              </FormControl.Label>
              <div className="flex items-center gap-2">
                <FormControl
                  disabled
                  value={user?.info?.name ?? ""}
                  id="author-name"
                  placeholder="Enter author name"
                  className={cn(errors.author && "border-destructive")}
                />
                <FormControl
                  disabled
                  value={user?.info?._id ?? ""}
                  id="author"
                  placeholder="Enter author _id"
                  {...register("author")}
                  className={cn(errors.author && "border-destructive")}
                />
              </div>
              {errors.author && (
                <p className="text-destructive mt-1 text-sm">
                  {errors.author.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col space-y-4 self-stretch">
            <div className="h-full flex-1">
              <ImageUpload
                name="thumbnail"
                label="Thumbnail"
                className="h-full"
              />
            </div>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

const ContentEditor = () => {
  const {
    setValue,
    formState: { errors },
  } = useFormContext<NewsFormData>();
  const { setting } = useSetting();

  const blockNoteEditor = useCreateBlockNote({
    initialContent: [
      {
        type: "paragraph",
        content: "Start writing your article...",
      },
    ],
    domAttributes: {
      editor: {
        style: "min-height: 350px; padding-top: 1rem; padding-bottom: 1rem;",
      },
    },
    uploadFile: async (file: File) => {
      let fileType: "image" | "video" | "audio" | "file" = "file";

      if (file.type.startsWith("image/")) fileType = "image";
      else if (file.type.startsWith("video/")) fileType = "video";
      else if (file.type.startsWith("audio/")) fileType = "audio";

      const { data } = await uploadNewsFile(file, fileType);
      return data?.filename ? URLS.news_images + "/" + data?.filename : "";
    },
  });

  return (
    <Card>
      <Card.Header className="border-b">
        <Card.Title>Content *</Card.Title>
      </Card.Header>
      <Card.Content>
        <div className="rounded-md border p-2">
          <BlockNoteView
            theme={setting?.theme === "dark" ? "dark" : "light"}
            editor={blockNoteEditor}
            onChange={() => {
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
  );
};

const CategoriesAndTags = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<NewsFormData>();
  const layout = watch("layout");

  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategoriesTree({ sort: "sequence" }),
  });

  return (
    <Card>
      <Card.Header className="border-b">
        <Card.Title>Categories & Tags</Card.Title>
      </Card.Header>
      <Card.Content className="space-y-4">
        <div>
          <FormControl.Label htmlFor="category">Category *</FormControl.Label>
          <FormControl
            as="select"
            id="category"
            onChange={(e) => setValue("category", e.target.value)}
            className={cn(errors.category && "border-destructive")}
          >
            <option value="">Select a category</option>
            {data?.data?.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </FormControl>
          {errors.category && (
            <p className="text-destructive mt-1 text-sm">
              {errors.category.message}
            </p>
          )}
        </div>

        <TagsInput name="tags" label="Tags" placeholder="Add tag" />

        <div>
          <FormControl.Label htmlFor="layout">Layout</FormControl.Label>
          <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-4">
            {["default", "standard", "featured", "minimal"].map(
              (layoutOption) => (
                <div
                  key={layoutOption}
                  className={cn(
                    "cursor-pointer rounded-md border p-2 text-center",
                    layout === layoutOption
                      ? "border-primary bg-primary/10"
                      : "border-muted",
                  )}
                  onClick={() =>
                    setValue(
                      "layout",
                      layoutOption as
                        | "default"
                        | "standard"
                        | "featured"
                        | "minimal",
                    )
                  }
                >
                  <div className="font-medium capitalize">{layoutOption}</div>
                </div>
              ),
            )}
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

const SEOSection = () => {
  const { register } = useFormContext<NewsFormData>();

  return (
    <Card>
      <Card.Header className="border-b">
        <Card.Title>SEO Settings</Card.Title>
      </Card.Header>
      <Card.Content className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4 self-stretch">
            <div>
              <FormControl.Label htmlFor="seo-title">
                SEO Title
              </FormControl.Label>
              <FormControl
                id="seo-title"
                placeholder="SEO Title"
                {...register("seo.title")}
              />
            </div>

            <div>
              <FormControl.Label htmlFor="seo-description">
                SEO Description
              </FormControl.Label>
              <FormControl
                className="h-20 py-2"
                placeholder="SEO Description"
                as="textarea"
                id="seo-description"
                {...register("seo.description")}
              />
            </div>

            <TagsInput
              name="seo.keywords"
              label="SEO Keywords"
              placeholder="Add keyword"
            />
          </div>
          <div className="flex flex-col self-stretch">
            <ImageUpload
              className="flex-1"
              name="seo.image"
              label="SEO Image"
            />
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

const PublishSettings = () => {
  const { setValue, watch } = useFormContext<NewsFormData>();
  const status = watch("status");
  const publishedAt = watch("published_at");

  const handlePublishedAtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("published_at", value ? new Date(value) : undefined);
  };

  const handleExpiredAtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("expired_at", value ? new Date(value) : undefined);
  };

  const formatDateTimeLocal = (date: Date | undefined) => {
    if (!date) return "";
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };

  return (
    <Card>
      <Card.Header className="border-b">
        <Card.Title>Publish Settings</Card.Title>
      </Card.Header>
      <Card.Content className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <FormControl.Label htmlFor="is_news_headline">
                News Headline
              </FormControl.Label>
              <p className="text-muted-foreground text-sm">
                Display at the top of news headline section
              </p>
            </div>
            <Switch
              id="is_news_headline"
              checked={watch("is_news_headline")}
              onChange={(checked) => setValue("is_news_headline", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <FormControl.Label htmlFor="is_news_break">
                News Break
              </FormControl.Label>
              <p className="text-muted-foreground text-sm">
                Display as news break
              </p>
            </div>
            <Switch
              id="is_news_break"
              checked={watch("is_news_break")}
              onChange={(checked) => setValue("is_news_break", checked)}
            />
          </div>

          {/* <div className="flex items-center justify-between">
            <div>
              <FormControl.Label htmlFor="is_premium">
                Premium
              </FormControl.Label>
              <p className="text-muted-foreground text-sm">
                Require subscription to view
              </p>
            </div>
            <Switch
              id="is_premium"
              checked={watch("is_premium")}
              onChange={(checked) => setValue("is_premium", checked)}
            />
          </div> */}

          <div className="flex items-center justify-between">
            <div>
              <FormControl.Label htmlFor="is_featured">
                Featured
              </FormControl.Label>
              <p className="text-muted-foreground text-sm">
                Show in featured articles section
              </p>
            </div>
            <Switch
              id="is_featured"
              checked={watch("is_featured")}
              onChange={(checked) => setValue("is_featured", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <FormControl.Label htmlFor="sequence">Sequence</FormControl.Label>
              <p className="text-muted-foreground text-sm">
                Display order for featured articles
              </p>
            </div>
            <FormControl
              className="flex h-8 w-12 items-center justify-center px-0 text-center"
              min={0}
              max={8}
              as="input"
              type="number"
              id="sequence"
              value={watch("sequence")}
              onChange={(e) => setValue("sequence", Number(e.target.value))}
            />
          </div>
        </div>
        <hr />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FormControl.Label htmlFor="published_at">
              Publish Date
            </FormControl.Label>
            <FormControl
              as="input"
              className="w-full"
              id="published_at"
              type="datetime-local"
              value={formatDateTimeLocal(publishedAt)}
              onChange={handlePublishedAtChange}
            />
          </div>

          <div>
            <FormControl.Label htmlFor="expired_at">
              Expiry Date
            </FormControl.Label>
            <FormControl
              as="input"
              className="w-full"
              id="expired_at"
              type="datetime-local"
              min={formatDateTimeLocal(publishedAt)}
              onChange={handleExpiredAtChange}
            />
          </div>
        </div>
        <div>
          <FormControl.Label htmlFor="status">Status</FormControl.Label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {["draft", "published"].map((statusOption) => (
              <div
                key={statusOption}
                className={cn(
                  "cursor-pointer rounded-md border p-2 text-center",
                  status === statusOption
                    ? "border-primary bg-primary/10"
                    : "border-muted",
                )}
                onClick={() => setValue("status", statusOption as any)}
              >
                <div className="font-medium capitalize">{statusOption}</div>
              </div>
            ))}
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

// ================ Main Component ================
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

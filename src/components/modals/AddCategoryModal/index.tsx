import { Button } from "@/components/ui/Button";
import { FormControl } from "@/components/ui/FormControl";
import { Modal } from "@/components/ui/Modal";
import { createCategory } from "@/services/category.service";
import type { TCategory } from "@/types/category.type";
import type { ErrorResponse } from "@/types/response.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type AddCategoryModalProps = {
  default?: Partial<TCategory>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  className?: string;
  key?: "category" | "categories" | "subcategories";
};

// Update type to include new fields
type CategoryFormValues = {
  icon?: string;
  name: string;
  slug: string;
  sequence: number;
  status: "active" | "inactive";
  description?: string;
  is_featured: boolean;
  layout: string;
};

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  setIsOpen,
  default: category,
  key = "categories",
}) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    defaultValues: {
      icon: category?.icon || "blocks",
      name: category?.name || "",
      slug: category?.slug || "",
      sequence: category?.sequence || 0,
      status: category?.status || "active",
      description: category?.description || "",
      is_featured: category?.is_featured || false,
      layout: category?.layout || "default",
    },
  });

  const mutation = useMutation({
    mutationFn: createCategory,
    onSuccess: (data) => {
      toast.success(data?.message || "Category created successfully!");
      queryClient.invalidateQueries({ queryKey: [key] });
      reset();
      setIsOpen(false);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || "Failed to create category");
      console.error("Create Category Error:", error);
    },
  });

  const onSubmit = (data: CategoryFormValues) => {
    mutation.mutate({
      ...(category?.category ? { category: category.category } : {}),
      ...data,
    });
  };

  // Auto-generate slug from name
  const nameValue = watch("name");
  React.useEffect(() => {
    const slugValue = nameValue
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setValue("slug", slugValue);
  }, [nameValue, setValue]);

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Modal.Backdrop>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>
              {category ? "Add Subcategory" : "Add Category"}
            </Modal.Title>
            <Modal.Close />
          </Modal.Header>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Body className="grid gap-4">
              {/* Icon (Optional) */}
              <div>
                <FormControl.Label>Icon (Optional)</FormControl.Label>
                <FormControl
                  type="text"
                  placeholder="e.g. blocks, home"
                  {...register("icon")}
                />
                <FormControl.Helper>
                  Enter a Lucide icon name (optional).
                </FormControl.Helper>
              </div>

              {/* Name */}
              <div>
                <FormControl.Label>Name</FormControl.Label>
                <FormControl
                  type="text"
                  placeholder="Category name"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <FormControl.Error>{errors.name.message}</FormControl.Error>
                )}
              </div>

              {/* Slug */}
              <div>
                <FormControl.Label>Slug</FormControl.Label>
                <FormControl
                  type="text"
                  placeholder="category-slug"
                  {...register("slug", { required: "Slug is required" })}
                />
                {errors.slug && (
                  <FormControl.Error>{errors.slug.message}</FormControl.Error>
                )}
              </div>

              {/* Description (Optional) - Added */}
              <div>
                <FormControl.Label>Description (Optional)</FormControl.Label>
                <FormControl
                  as={"textarea"}
                  className="h-auto min-h-20 py-2"
                  placeholder="Category description"
                  {...register("description")}
                />
              </div>

              {/* Sequence */}
              <div>
                <FormControl.Label>Sequence</FormControl.Label>
                <FormControl
                  type="number"
                  placeholder="0"
                  {...register("sequence", {
                    required: "Sequence is required",
                    valueAsNumber: true,
                  })}
                />
                {errors.sequence && (
                  <FormControl.Error>
                    {errors.sequence.message}
                  </FormControl.Error>
                )}
              </div>

              {/* Status */}
              <div>
                <FormControl.Label>Status</FormControl.Label>
                <FormControl
                  as="select"
                  className="border-input bg-card w-full rounded-md border px-3 py-2 text-sm"
                  {...register("status", { required: "Status is required" })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </FormControl>
                {errors.status && (
                  <FormControl.Error>{errors.status.message}</FormControl.Error>
                )}
              </div>

              {/* Layout - Added */}
              <div>
                <FormControl.Label>Layout</FormControl.Label>
                <FormControl
                  as="select"
                  className="border-input bg-card w-full rounded-md border px-3 py-2 text-sm"
                  {...register("layout", { required: "Layout is required" })}
                >
                  <option value="default">Default</option>
                  <option value="highlight">Highlight</option>
                  <option value="grid-card">Grid Card</option>
                </FormControl>
                {errors.layout && (
                  <FormControl.Error>{errors.layout.message}</FormControl.Error>
                )}
              </div>

              {/* Featured - Added */}
              <div>
                <label className="inline-flex items-center gap-2">
                  <input
                    className="accent-accent size-5"
                    type="checkbox"
                    id="is_featured"
                    {...register("is_featured")}
                  />
                  <span className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Featured
                  </span>
                </label>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Content>
      </Modal.Backdrop>
    </Modal>
  );
};

export default AddCategoryModal;

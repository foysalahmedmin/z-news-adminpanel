import { Button } from "@/components/ui/Button";
import { FormControl } from "@/components/ui/FormControl";
import { Modal } from "@/components/ui/Modal";
import { createCategory } from "@/services/category.service";
import type { ErrorResponse } from "@/types/response.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type AddCategoryModalProps = {
  category?: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  className?: string;
};

type CategoryFormValues = {
  icon?: string;
  name: string;
  slug: string;
  sequence: number;
  status: "active" | "inactive";
};

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  setIsOpen,
  category,
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
      icon: "blocks",
      name: "",
      slug: "",
      sequence: 0,
      status: "active",
    },
  });

  const mutation = useMutation({
    mutationFn: createCategory,
    onSuccess: (data) => {
      toast.success(data?.message || "Category created successfully!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
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
      ...(category ? { category: category } : {}),
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
                  placeholder="e.g. Home, Settings"
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

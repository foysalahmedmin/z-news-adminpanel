import { Button } from "@/components/ui/Button";
import { FormControl } from "@/components/ui/FormControl";
import { Modal } from "@/components/ui/Modal";
import { updateCategory } from "@/services/category.service";
import type { TCategory, TCategoryUpdatePayload } from "@/types/category.type";
import type { ErrorResponse } from "@/types/response.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type EditCategoryModalProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  id: string;
  initialValues: TCategory;
};

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  isOpen,
  setIsOpen,
  id,
  initialValues,
}) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TCategoryUpdatePayload>({
    defaultValues: {
      icon: initialValues.icon || "",
      name: initialValues.name,
      slug: initialValues.slug,
      sequence: initialValues.sequence,
      status: initialValues.status,
    },
  });

  React.useEffect(() => {
    reset({
      icon: initialValues.icon || "",
      name: initialValues.name,
      slug: initialValues.slug,
      sequence: initialValues.sequence,
      status: initialValues.status,
    });
  }, [initialValues, reset]);

  const mutation = useMutation({
    mutationFn: (data: TCategoryUpdatePayload) => updateCategory(id, data),
    onSuccess: (data) => {
      toast.success(data?.message || "Category updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setIsOpen(false);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || "Failed to update category");
      console.error("Update Category Error:", error);
    },
  });

  const onSubmit = (data: TCategoryUpdatePayload) => {
    const updatedFields = Object.entries(data).reduce<
      Partial<TCategoryUpdatePayload>
    >((acc, [key, value]) => {
      const fieldKey = key as keyof TCategoryUpdatePayload;

      if (value !== initialValues?.[fieldKey]) {
        (acc as any)[fieldKey] = value;
      }

      return acc;
    }, {});

    if (Object.keys(updatedFields).length === 0) {
      toast.info("No changes detected");
      return;
    }

    mutation.mutate(updatedFields);
  };

  const nameValue = watch("name");
  React.useEffect(() => {
    const slugValue = nameValue
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setValue("slug", slugValue);
  }, [nameValue, setValue]);

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Modal.Backdrop>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Edit Category</Modal.Title>
            <Modal.Close />
          </Modal.Header>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Body className="grid gap-4">
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
                Update
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Content>
      </Modal.Backdrop>
    </Modal>
  );
};

export default EditCategoryModal;

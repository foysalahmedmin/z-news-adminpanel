import CategoriesDataTableSection from "@/components/(common)/categories-page/CategoriesDataTableSection";
import CategoriesStatisticsSection from "@/components/(common)/categories-page/CategoriesStatisticsSection";
import AddCategoryModal from "@/components/modals/AddCategoryModal";
import EditCategoryModal from "@/components/modals/EditCategoryModal";
import PageHeader from "@/components/sections/PageHeader";
import { Card } from "@/components/ui/Card";
import useMenu from "@/hooks/states/useMenu";
import useAlert from "@/hooks/ui/useAlert";
import { deleteCategory, fetchCategories } from "@/services/category.service";
import type { TCategory } from "@/types/category.type";
import type { ErrorResponse } from "@/types/response.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

const CategoriesPage = () => {
  const { activeBreadcrumbs } = useMenu();
  const queryClient = useQueryClient();
  const confirm = useAlert();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditAddModalOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<TCategory>(
    {} as TCategory,
  );

  const onOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const onOpenEditModal = (category: TCategory) => {
    setSelectedCategory(category);
    setIsEditAddModalOpen(true);
  };

  const mutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: (data) => {
      toast.success(data?.message || "Category deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || "Failed to delete category");
      console.error("Delete Category Error:", error);
    },
  });

  const onDelete = async (category: TCategory) => {
    const ok = await confirm({
      title: "Delete Category",
      message: "Are you sure you want to delete this category?",
      confirmText: "Delete",
      cancelText: "Cancel",
    });
    if (ok) {
      mutation.mutate(category._id);
    }
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories({ sort: "sequence" }),
  });

  return (
    <main className="space-y-6">
      <PageHeader />
      <CategoriesStatisticsSection data={data?.data || []} />
      <Card>
        <Card.Content>
          <CategoriesDataTableSection
            data={data?.data || []}
            breadcrumbs={activeBreadcrumbs || []}
            isLoading={isLoading}
            isError={isError}
            onAdd={onOpenAddModal}
            onEdit={onOpenEditModal}
            onDelete={onDelete}
          />
        </Card.Content>
      </Card>
      <AddCategoryModal
        isOpen={isAddModalOpen}
        setIsOpen={setIsAddModalOpen}
        default={{ sequence: data?.meta?.total || data?.data?.length || 0 }}
      />
      <EditCategoryModal
        default={selectedCategory}
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditAddModalOpen}
      />
    </main>
  );
};

export default CategoriesPage;

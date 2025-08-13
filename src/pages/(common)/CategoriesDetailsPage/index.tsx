import CategoryDataTableSection from "@/components/(common)/categories-details-page/CategoryDataTableSection";
import CategoryInfoSection from "@/components/(common)/categories-details-page/CategoryInfoSection";
import CategoryOverviewSection from "@/components/(common)/categories-details-page/CategoryOverviewSection";
import AddCategoryModal from "@/components/modals/AddCategoryModal";
import EditCategoryModal from "@/components/modals/EditCategoryModal";
import PageHeader from "@/components/sections/PageHeader";
import { Card } from "@/components/ui/Card";
import { Tabs } from "@/components/ui/Tabs";
import useAlert from "@/hooks/ui/useAlert";
import { deleteCategory, fetchCategory } from "@/services/category.service";
import type { TCategory } from "@/types/category.type";
import type { ErrorResponse } from "@/types/response.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";
import { useLocation, useParams } from "react-router";
import { toast } from "react-toastify";

const CategoriesDetailsPage = () => {
  const queryClient = useQueryClient();
  const confirm = useAlert();

  const { state } = useLocation();
  const { id } = useParams();

  const { breadcrumbs } = state || {};

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditAddModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<TCategory>(
    {} as TCategory,
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: ["category", id],
    queryFn: () => fetchCategory(id || ""),
  });

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
      queryClient.invalidateQueries({ queryKey: ["category"] });
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

  return (
    <main className="space-y-6">
      <PageHeader breadcrumbs={breadcrumbs} name="Category Details" />

      <Card>
        <Card.Content className="py-6">
          <CategoryInfoSection category={data?.data} />
        </Card.Content>
      </Card>

      <Card>
        <Tabs value={"overview"}>
          <Card.Header className="pb-0">
            <Tabs.List className="justify-start">
              <Tabs.Trigger value="overview">Description</Tabs.Trigger>
              <Tabs.Trigger value="subcategories">Subcategories</Tabs.Trigger>
            </Tabs.List>
          </Card.Header>
          <Card.Content>
            <Tabs.Content>
              <Tabs.Item value="overview">
                <CategoryOverviewSection category={data?.data || {}} />
              </Tabs.Item>
              <Tabs.Item value="subcategories">
                <CategoryDataTableSection
                  data={data?.data?.children || []}
                  breadcrumbs={breadcrumbs}
                  isLoading={isLoading}
                  isError={isError}
                  onAdd={onOpenAddModal}
                  onEdit={onOpenEditModal}
                  onDelete={onDelete}
                />
              </Tabs.Item>
            </Tabs.Content>
          </Card.Content>
        </Tabs>
      </Card>

      <AddCategoryModal
        isOpen={isAddModalOpen}
        setIsOpen={setIsAddModalOpen}
        default={{
          category: data?.data?._id,
          sequence: data?.data?.children?.length || 0,
        }}
        key="category"
      />
      <EditCategoryModal
        default={selectedCategory}
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditAddModalOpen}
        key="category"
      />
    </main>
  );
};

export default CategoriesDetailsPage;

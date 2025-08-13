import CategoriesDataTableSection from "@/components/(common)/categories-page/CategoriesDataTableSection";
import CategoriesStatisticsSection from "@/components/(common)/categories-page/CategoriesStatisticsSection";
import AddCategoryModal from "@/components/modals/AddCategoryModal";
import EditCategoryModal from "@/components/modals/EditCategoryModal";
import PageHeader from "@/components/sections/PageHeader";
import useMenu from "@/hooks/states/useMenu";
import { fetchCategories } from "@/services/category.service";
import type { TCategory } from "@/types/category.type";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const CategoriesPage = () => {
  const { activeBreadcrumbs } = useMenu();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditAddModalOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<TCategory>(
    {} as TCategory,
  );

  const onOpenEditModal = (category: TCategory) => {
    setSelectedCategory(category);
    setIsEditAddModalOpen(true);
  };

  const onOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories({ sort: "sequence" }),
  });

  return (
    <main className="space-y-6">
      <PageHeader />
      <CategoriesStatisticsSection data={data?.data || []} />
      <CategoriesDataTableSection
        data={data?.data || []}
        breadcrumbs={activeBreadcrumbs || []}
        isLoading={isLoading}
        isError={isError}
        onAdd={onOpenAddModal}
        onEdit={onOpenEditModal}
        onDelete={() => {}}
      />
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

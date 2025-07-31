import AddCategoryModal from "@/components/(common)/category-page/AddCategoryModal";
import PageHeader from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

const CategoryPage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditAddModalOpen] = useState(false);
  return (
    <main className="space-y-6">
      <PageHeader
        slot={
          <Button onClick={() => setIsAddModalOpen(true)}>Add Category</Button>
        }
      />
      <AddCategoryModal isOpen={isAddModalOpen} setIsOpen={setIsAddModalOpen} />
    </main>
  );
};

export default CategoryPage;

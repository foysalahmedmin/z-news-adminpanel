import AddCategoryModal from "@/components/(common)/category-page/AddCategoryModal";
import PageHeader from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { TColumn } from "@/components/ui/DataTable";
import DataTable from "@/components/ui/DataTable";
import Icon from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { fetchCategories } from "@/services/category.service";
import type { TCategory } from "@/types/category.type";
import { useQuery } from "@tanstack/react-query";
import { Edit, Trash } from "lucide-react";
import { useState } from "react";

const CategoryPage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditAddModalOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(),
  });

  const columns: TColumn<TCategory>[] = [
    { name: "Sequence", field: "sequence", isSortable: true },
    {
      name: "Icon",
      field: "icon",
      formatter: (cell) => (
        <span>
          <Icon name={cell} />
        </span>
      ),
    },
    { name: "Name", field: "name", isSortable: true },
    { name: "Slug", field: "slug", isSortable: true },
    {
      name: "Status",
      field: "status",
      isSortable: true,
      formatter: (cell) => (
        <span
          className={cn(
            "rounded-full px-2 py-1 text-xs font-medium",
            cell === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800",
          )}
        >
          {cell !== "active" ? "Inactive" : "Active"}
        </span>
      ),
    },
    {
      style: { width: "150px", textAlign: "center" },
      name: "Actions",
      field: "_id",
      isSpecial: true,
      formatter: () => (
        <div className="flex w-full items-center justify-center space-x-2">
          <Button size={"sm"} variant="outline" shape={"icon"}>
            <Edit className="size-4" />
          </Button>
          <Button
            className="[--accent:red]"
            size={"sm"}
            variant="outline"
            shape={"icon"}
          >
            <Trash className="size-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <main className="space-y-6">
      <PageHeader
        slot={
          <Button onClick={() => setIsAddModalOpen(true)}>Add Category</Button>
        }
      />
      <Card>
        <Card.Header>
          <Card.Title>User Activities</Card.Title>
        </Card.Header>
        <Card.Content>
          <DataTable
            columns={columns}
            data={data?.data || []}
            config={{
              isSortProcessed: false,
              isPaginationProcessed: false,
            }}
          />
        </Card.Content>
      </Card>
      <AddCategoryModal isOpen={isAddModalOpen} setIsOpen={setIsAddModalOpen} />
    </main>
  );
};

export default CategoryPage;

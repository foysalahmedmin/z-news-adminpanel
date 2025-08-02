import AddCategoryModal from "@/components/(common)/category-page/AddCategoryModal";
import EditCategoryModal from "@/components/(common)/category-page/EditCategoryModal";
import PageHeader from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { TColumn } from "@/components/ui/DataTable";
import DataTable from "@/components/ui/DataTable";
import Icon from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { fetchCategory } from "@/services/category.service";
import type { TCategory } from "@/types/category.type";
import { useQuery } from "@tanstack/react-query";
import { Edit, Eye, Trash } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useParams } from "react-router";

const CategoryDetailsPage = () => {
  const { state } = useLocation();
  const { id } = useParams();

  const { breadcrumbs } = state || {};

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditAddModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<TCategory>(
    {} as TCategory,
  );

  const onOpenEditModal = (category: TCategory) => {
    setSelectedCategory(category);
    setIsEditAddModalOpen(true);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["category", id],
    queryFn: () => fetchCategory(id || ""),
  });

  const categoryInfo = data?.data;

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
      formatter: (_cell, row) => (
        <div className="flex w-full items-center justify-center gap-2">
          <Button
            asChild
            className="[--accent:green]"
            size="sm"
            variant="outline"
            shape="icon"
          >
            <Link
              to={`/categories/${row._id}`}
              state={{
                category: row,
                breadcrumbs: [
                  ...(breadcrumbs || []),
                  { name: row.name, path: `/categories/${row._id}` },
                ],
              }}
            >
              <Eye className="size-4" />
            </Link>
          </Button>
          <Button
            onClick={() => onOpenEditModal(row)}
            size="sm"
            variant="outline"
            shape="icon"
          >
            <Edit className="size-4" />
          </Button>
          <Button
            className="[--accent:red]"
            size="sm"
            variant="outline"
            shape="icon"
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
        breadcrumbs={breadcrumbs}
        slot={
          <Button onClick={() => setIsAddModalOpen(true)}>
            Add Sub Category
          </Button>
        }
      />

      {/* Category Info Card */}
      {categoryInfo && (
        <Card>
          <Card.Header>
            <Card.Title>Information</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <span className="font-semibold">Name:</span> {categoryInfo.name}
              </div>
              <div>
                <span className="font-semibold">Slug:</span> {categoryInfo.slug}
              </div>
              <div>
                <span className="font-semibold">Sequence:</span>{" "}
                {categoryInfo.sequence}
              </div>
              <div>
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={cn(
                    "rounded-full px-2 py-1 text-xs font-medium",
                    categoryInfo.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800",
                  )}
                >
                  {categoryInfo.status !== "active" ? "Inactive" : "Active"}
                </span>
              </div>
              <div>
                <span className="font-semibold">Icon:</span>{" "}
                <Icon name={categoryInfo.icon} className="ml-1 inline-block" />
              </div>
            </div>
          </Card.Content>
        </Card>
      )}

      {/* Sub Categories Table */}
      {!!categoryInfo?.children?.length && (
        <Card>
          <Card.Header>
            <Card.Title>Sub Categories</Card.Title>
          </Card.Header>
          <Card.Content>
            <DataTable
              status={isLoading ? "loading" : isError ? "error" : "success"}
              columns={columns}
              data={categoryInfo?.children || []}
              config={{
                isSortProcessed: false,
                isPaginationProcessed: false,
              }}
            />
          </Card.Content>
        </Card>
      )}

      <AddCategoryModal
        isOpen={isAddModalOpen}
        setIsOpen={setIsAddModalOpen}
        category={categoryInfo?._id}
      />
      <EditCategoryModal
        category={selectedCategory}
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditAddModalOpen}
      />
    </main>
  );
};

export default CategoryDetailsPage;

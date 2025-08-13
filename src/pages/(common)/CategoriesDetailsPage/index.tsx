import CategoryInfo from "@/components/(common)/category-details-page/CategoryInfo";
import AddCategoryModal from "@/components/(common)/category-page/AddCategoryModal";
import EditCategoryModal from "@/components/(common)/category-page/EditCategoryModal";
import PageHeader from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { TColumn } from "@/components/ui/DataTable";
import DataTable from "@/components/ui/DataTable";
import Icon from "@/components/ui/Icon";
import { Switch } from "@/components/ui/Switch";
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
      cell: ({ cell }) => (
        <span>
          <Icon name={cell} />
        </span>
      ),
    },
    { name: "Name", field: "name", isSortable: true, isSearchable: true },
    { name: "Slug", field: "slug", isSortable: true },
    {
      name: "Layout",
      field: "layout",
      isSortable: true,
      cell: ({ cell }) => <span>{cell?.toString()}</span>,
    },
    {
      name: "Status",
      field: "status",
      isSortable: true,
      cell: ({ cell }) => (
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
      name: "Featured",
      field: "is_featured",
      isSortable: true,
      cell: ({ cell }) => (
        <div>
          <Switch checked={cell === true} />
        </div>
      ),
    },
    {
      style: { width: "150px", textAlign: "center" },
      name: "Actions",
      field: "_id",
      cell: ({ row }) => (
        <div className="flex w-full items-center justify-center gap-2">
          <Button
            asChild={true}
            className="[--accent:green]"
            size={"sm"}
            variant="outline"
            shape={"icon"}
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
            size={"sm"}
            variant="outline"
            shape={"icon"}
          >
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
        breadcrumbs={breadcrumbs}
        name="Category Details"
        slot={
          <Button onClick={() => setIsAddModalOpen(true)}>
            Add Sub Category
          </Button>
        }
      />

      {/* Category Info Card */}
      {categoryInfo && (
        <Card>
          <Card.Content className="py-6">
            <CategoryInfo category={categoryInfo} />
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
        default={{
          category: categoryInfo?._id,
          sequence: categoryInfo?.children?.length || 0,
        }}
      />
      <EditCategoryModal
        default={selectedCategory}
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditAddModalOpen}
      />
    </main>
  );
};

export default CategoryDetailsPage;

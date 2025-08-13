import type { TCategory } from "@/types/category.type";
import { FileText } from "lucide-react";
import React from "react";

export type TCategoryOverviewSectionProps = {
  category?: Partial<TCategory>;
};
const CategoryOverviewSection: React.FC<TCategoryOverviewSectionProps> = ({
  category,
}) => {
  return (
    <div className="space-y-6">
      {/* Description */}
      {category?.description && (
        <div>
          <h3 className="mb-3 flex items-center text-lg font-semibold text-gray-900">
            <FileText className="mr-2 h-5 w-5" />
            Description
          </h3>
          <p className="leading-relaxed text-gray-700">
            {category.description}
          </p>
        </div>
      )}

      {/* Category Details */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Category Details
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="mb-1 text-sm text-gray-500">Category ID</div>
            <div className="font-mono text-sm text-gray-900">
              {category?._id}
            </div>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="mb-1 text-sm text-gray-500">Parent Category</div>
            <div className="text-sm text-gray-900">
              {category?.category || "None"}
            </div>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="mb-1 text-sm text-gray-500">Layout Type</div>
            <div className="flex items-center text-sm text-gray-900">
              {category?.layout || "Default"}
            </div>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="mb-1 text-sm text-gray-500">Subcategories</div>
            <div className="text-sm text-gray-900">
              {category?.children?.length || 0} items
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryOverviewSection;

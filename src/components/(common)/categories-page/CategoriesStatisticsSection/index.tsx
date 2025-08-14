import {
  StatisticCard,
  type TStatistic,
} from "@/components/cards/StatisticCard";
import type { TCategory } from "@/types/category.type";
import React from "react";

type CategoriesStatisticsSectionProps = {
  data?: TCategory[];
};

const CategoriesStatisticsSection: React.FC<
  CategoriesStatisticsSectionProps
> = ({ data }) => {
  const total = data?.length || 0;
  const totalActive = data?.filter((d) => d?.status === "active").length || 0;
  const totalInactive =
    data?.filter((d) => d?.status === "inactive").length || 0;
  const totalFeatured = data?.filter((d) => d?.is_featured).length || 0;

  const statistics: TStatistic[] = [
    {
      value: total,
      title: "Total Categories",
      subtitle: "Includes all categories",
      description: "Overall count of categories in the system.",
      icon: "folder-open",
    },
    {
      value: totalActive,
      title: "Active Categories",
      subtitle: "Currently active",
      description: "Categories that are active and visible to users.",
      icon: "check-circle",
    },
    {
      value: totalInactive,
      title: "Inactive Categories",
      subtitle: "Currently inactive",
      description: "Categories that are disabled or hidden from users.",
      icon: "x-circle",
    },
    {
      value: totalFeatured,
      title: "Featured Categories",
      subtitle: "Highlighted selection",
      description: "Special categories marked as featured for promotion.",
      icon: "star",
    },
  ];
  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {statistics.map((item, index) => (
        <StatisticCard key={index} item={item} />
      ))}
    </div>
  );
};

export default CategoriesStatisticsSection;

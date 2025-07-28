import type { TBreadcrumbs } from "@/components/ui/Breadcrumb";
import Breadcrumb from "@/components/ui/Breadcrumb";
import useMenu from "@/hooks/states/useMenu";
import type { ReactNode } from "react";

type AdminPageHeaderProps = {
  title: string;
  description?: string;
  breadcrumbs: TBreadcrumbs;
  actions?: ReactNode; // Buttons, filters, etc.
};

export function AdminPageHeader({
  title,
  description,
  breadcrumbs,
  actions,
}: AdminPageHeaderProps) {
  const { activeBreadcrumbs } = useMenu();

  const items = breadcrumbs || activeBreadcrumbs || [];
  const label = items[items.length - 1]?.label || title;
  return (
    <header className="mb-6 flex flex-col gap-4 border-b pb-4">
      {/* Breadcrumb */}
      <Breadcrumb items={items} />

      {/* Title & Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-semibold capitalize">
            {label}
          </h1>
          {description && (
            <p className="text-muted-foreground mt-1 text-sm">{description}</p>
          )}
        </div>

        {/* Right Side Actions */}
        {actions && (
          <div className="flex items-center space-x-2">{actions}</div>
        )}
      </div>
    </header>
  );
}

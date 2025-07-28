import useMenu from "@/hooks/states/useMenu";
import { ChevronRight } from "lucide-react";

export type TBreadcrumbs = {
  index: number;
  label: string;
  path?: string;
}[];

interface BreadcrumbProps {
  items: TBreadcrumbs;
  onNavigate?: (path: string) => void;
}

const Breadcrumb = ({ items: itemsProp, onNavigate }: BreadcrumbProps) => {
  const { activeBreadcrumbs } = useMenu();

  const items = itemsProp || activeBreadcrumbs || [];
  return (
    <nav className="text-muted-foreground flex items-center space-x-1 text-sm">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;

        return (
          <div key={item.index} className="flex items-center space-x-1">
            {item.path && !isLast ? (
              <button
                onClick={() => onNavigate?.(item.path!)}
                className="hover:text-primary transition-colors"
              >
                {item.label}
              </button>
            ) : (
              <span className="text-foreground">{item.label}</span>
            )}

            {!isLast && (
              <ChevronRight size={14} className="text-muted-foreground" />
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;

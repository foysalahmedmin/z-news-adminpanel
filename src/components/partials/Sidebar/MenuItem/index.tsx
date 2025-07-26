import useMenu from "@/hooks/states/useMenu";
import { cn } from "@/lib/utils";
import type { IProcessedMenu } from "@/types/route-menu.type";
import { ChevronRight } from "lucide-react";
import React from "react";
import { NavLink } from "react-router";
import SubMenuItem from "./SubMenuItem";

type Props = {
  className?: string;
  item: IProcessedMenu;
  index: number;
};

const MenuItem: React.FC<Props> = ({ index, item, className }) => {
  const { activeIndex, setActiveIndex } = useMenu();
  const { label, path, children } = item || {};

  // Check if current item is active
  const isActive = index === activeIndex?.[0];

  const hasChildren = children && children.length > 0;

  const handleToggle = () => {
    if (isActive) {
      setActiveIndex([]);
    } else {
      setActiveIndex([index]);
    }
  };

  return (
    <div>
      {/* Menu Item */}
      <div
        className={cn("relative flex items-center justify-between", className)}
      >
        {/* Content */}
        {path ? (
          <NavLink
            to={path}
            className={({ isActive: isRouteActive }) =>
              cn(
                "hover:bg-muted flex h-10 flex-1 items-center gap-2 pr-12 pl-4 hover:underline",
                {
                  "text-primary font-medium": isRouteActive || isActive,
                },
              )
            }
          >
            <span className="flex-1">{label}</span>
            <span>{/* Badge placeholder */}</span>
          </NavLink>
        ) : (
          <div
            className={cn(
              "flex flex-1 cursor-pointer items-center gap-2 pr-12 pl-4",
              {
                "text-primary font-medium": isActive,
              },
            )}
            onClick={hasChildren ? handleToggle : undefined}
          >
            <span className="flex-1">{label}</span>
            <span>{/* Badge placeholder */}</span>
          </div>
        )}

        {/* Chevron */}
        {hasChildren && (
          <button
            onClick={handleToggle}
            className="absolute top-0 right-4 bottom-0 flex items-center px-2"
            aria-label={isActive ? "Collapse" : "Expand"}
          >
            <ChevronRight
              size={16}
              className={cn("transition-transform duration-200", {
                "rotate-90": isActive,
              })}
            />
          </button>
        )}
      </div>

      {/* Children */}
      {hasChildren && (
        <div
          className={cn("transition-all duration-200", {
            hidden: !isActive,
          })}
        >
          {children.map((child, index) => (
            <SubMenuItem
              key={`${index}`}
              item={child}
              indexPath={[index]}
              depth={1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuItem;

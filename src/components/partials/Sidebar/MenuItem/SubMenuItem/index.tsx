import useMenu from "@/hooks/states/useMenu";
import { cn } from "@/lib/utils";
import type { IProcessedMenu } from "@/types/route-menu.type";
import { ChevronRight } from "lucide-react";
import React from "react";
import { NavLink } from "react-router";

type Props = {
  className?: string;
  item: IProcessedMenu;
  indexPath: number[];
  depth: number;
};

const SubMenuItem: React.FC<Props> = ({
  indexPath = [],
  item,
  className = "",
  depth = 1,
}) => {
  const { activeIndex = [], setActiveIndex } = useMenu();
  const { label, path, children } = item;

  // Check if current item is active
  const isActive =
    activeIndex?.length > 0 &&
    activeIndex.slice(0, indexPath.length).join("") === indexPath.join("");

  const hasChildren = children && children.length > 0;

  const handleToggle = () => {
    if (isActive) {
      setActiveIndex(indexPath.slice(0, -1));
    } else {
      setActiveIndex(indexPath);
    }
  };

  const paddingLeft = `${depth + 1}rem`;

  return (
    <div>
      {/* Menu Item */}
      <div
        className={cn(
          "relative flex items-center justify-between pr-8",
          className,
        )}
        style={{ paddingLeft }}
      >
        {/* Content */}
        {path ? (
          <NavLink
            to={path}
            className={({ isActive: isRouteActive }) =>
              cn("flex flex-1 items-center gap-2 hover:underline", {
                "text-primary font-medium": isRouteActive || isActive,
              })
            }
          >
            <span className="flex-1">{label}</span>
            <span>{/* Badge placeholder */}</span>
          </NavLink>
        ) : (
          <div
            className={cn("flex flex-1 cursor-pointer items-center gap-2", {
              "text-primary font-medium": isActive,
            })}
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
            className="absolute top-0 right-0 bottom-0 flex items-center px-2"
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
              key={`${indexPath.join("-")}-${index}`}
              item={child}
              indexPath={[...indexPath, index]}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SubMenuItem;

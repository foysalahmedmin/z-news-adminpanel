import { Badge } from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import useMenu from "@/hooks/states/useMenu";
import useSetting from "@/hooks/states/useSetting";
import { cn } from "@/lib/utils";
import type { IProcessedMenu } from "@/types/route-menu.type";
import { ChevronRight, Dot } from "lucide-react";
import React from "react";
import { NavLink } from "react-router";
import SubMenuItem from "./SubMenuItem";

type Props = {
  className?: string;
  item: IProcessedMenu;
  index: number;
};

const Comp: React.FC<{
  children: React.ReactNode;
  className?: string;
  path?: string;
  onClick?: () => void;
}> = ({ children, className, path, onClick, ...props }) => {
  return (
    <>
      {path ? (
        <NavLink
          to={path}
          className={cn("", className)}
          onClick={onClick}
          {...props}
        >
          {children}
        </NavLink>
      ) : (
        <div className={cn("", className)} onClick={onClick} {...props}>
          {children}
        </div>
      )}
    </>
  );
};

const MenuItem: React.FC<Props> = ({ index, item }) => {
  const { setting } = useSetting();
  const isCompact = setting.sidebar === "compact";

  const { activeIndexPath, openIndexPath, setOpenIndexPath } = useMenu();
  const { menuType, label, path, badges, children } = item || {};

  // Check if current item is active
  const isActive = index === activeIndexPath?.[0];
  const isOpen = index === openIndexPath?.[0];

  const hasChildren = children && children.length > 0;

  const handleToggle = () => {
    if (isOpen) {
      setOpenIndexPath([]);
    } else {
      setOpenIndexPath([index]);
    }
  };

  if (menuType === "title") {
    return (
      <>
        <div
          className={cn(
            "text-muted-foreground flex items-center px-2 py-2 font-semibold uppercase lg:px-3",
          )}
        >
          {isCompact ? (
            <>
              <span
                className={cn(
                  "hidden lg:block lg:w-full lg:group-hover/sidebar:hidden",
                )}
              >
                <Dot className="size-6" />
              </span>
              <span className={cn("lg:hidden lg:group-hover/sidebar:block")}>
                {label}
              </span>
            </>
          ) : (
            <span className={cn("")}>{label}</span>
          )}
        </div>
      </>
    );
  }

  return (
    <div>
      {/* Menu Item */}
      <Comp
        path={path}
        onClick={handleToggle}
        className={cn(
          "relative flex items-center gap-2 px-2 py-2 lg:gap-3 lg:px-3",
          {
            "bg-accent/15": isActive,
          },
        )}
      >
        <div className="flex flex-shrink-0 items-center justify-center">
          <div className="flex size-6 items-center justify-center">
            {item.icon && (
              <Icon name={item.icon} strokeWidth={1.5} className="size-6" />
            )}
          </div>
        </div>
        <div
          className={cn(
            "relative flex flex-1 items-center justify-between tracking-wide",
            "overflow-hidden whitespace-nowrap opacity-100 transition-opacity duration-500",
          )}
        >
          {/* Content */}
          <div className="flex flex-1 cursor-pointer items-center gap-2">
            <span className="flex-1">{label}</span>
            <div className="flex gap-0.5">
              {badges?.map((badge) => <Badge key={badge}>{badge}</Badge>)}
            </div>
          </div>

          {/* Chevron */}
          {hasChildren && (
            <button
              onClick={(e) => {
                e.preventDefault(); // Prevent link navigation
                e.stopPropagation(); // Prevent bubbling to the Link
                handleToggle();
              }}
              className="absolute top-0 right-0 bottom-0 flex items-center"
              aria-label={isOpen ? "Collapse" : "Expand"}
            >
              <ChevronRight
                className={cn("size-4 transition-transform duration-300", {
                  "rotate-90": isOpen,
                })}
              />
            </button>
          )}
        </div>
      </Comp>

      {/* Children */}
      {hasChildren && (
        <div
          className={cn(
            "relative grid grid-rows-[0fr] overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out",
            {
              "grid-rows-[1fr]": isOpen,
              "lg:hidden lg:group-hover/sidebar:block": isCompact,
            },
          )}
        >
          <div
            className={cn(
              "invisible min-h-0 origin-top scale-y-0 overflow-hidden pl-2 opacity-0 transition-transform duration-300 ease-in-out lg:pl-3",
              {
                "visible min-h-fit origin-top scale-y-100 opacity-100 delay-100":
                  isOpen,
              },
            )}
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
        </div>
      )}
    </div>
  );
};

export default MenuItem;

import { Badge } from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import useMenu from "@/hooks/states/useMenu";
import useSetting from "@/hooks/states/useSetting";
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

const MenuItem: React.FC<Props> = ({ index, item, className }) => {
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
            "text-muted-foreground flex h-8 items-center font-semibold uppercase",
          )}
        >
          <span className={cn("")}>{label}</span>
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
        className={cn("relative flex items-center", {
          "bg-accent/15": isActive,
        })}
      >
        <div className="flex flex-shrink-0 items-center justify-center">
          <div className="flex size-8 items-center justify-center">
            {item.icon && <Icon name={item.icon} className="size-5" />}
          </div>
        </div>
        <div
          className={cn(
            "relative flex flex-1 items-center justify-between tracking-wide",
            "overflow-hidden whitespace-nowrap transition-[width,opacity] duration-500",
            {
              "lg:invisible lg:w-0 lg:opacity-0 lg:group-hover/sidebar:visible lg:group-hover/sidebar:opacity-100":
                isCompact,
            },
            className,
          )}
        >
          {/* Content */}
          <div
            className={cn("flex flex-1 cursor-pointer items-center gap-2", {
              "text-primary font-medium": isOpen,
            })}
          >
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
              className="absolute top-0 right-4 bottom-0 flex items-center px-2"
              aria-label={isOpen ? "Collapse" : "Expand"}
            >
              <ChevronRight
                size={16}
                className={cn("transition-transform duration-200", {
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
          className={cn("transition-all duration-200", {
            hidden: !isOpen,
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

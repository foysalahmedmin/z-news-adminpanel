import useMenu from "@/hooks/states/useMenu";
import useSetting from "@/hooks/states/useSetting";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import React, { memo } from "react";
import MenuItem from "./MenuItem";

interface SidebarProps {
  className?: string;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = memo(({ className, onClose }) => {
  const { menus } = useMenu();
  const { setting } = useSetting();
  const isCompact = setting.sidebar === "compact";

  const [sidebarHovered, setSidebarHovered] = React.useState(false);

  console.log(menus);

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Header */}
      <header
        className={cn(
          "bg-card/50 flex h-16 items-center justify-between border-b px-4 backdrop-blur-sm lg:h-20",
        )}
      >
        {/* Logo Section */}
        <div
          className={cn("flex h-full min-w-0 items-center", {
            "lg:mx-1": isCompact,
          })}
        >
          <div className={cn("flex-shrink-0")}>
            <img
              className="size-8 rounded-md lg:size-10"
              src="/logo.png"
              alt="Z-News Logo"
              loading="lazy"
            />
          </div>
          <h1
            className={cn(
              "text-foreground pl-2 text-lg font-bold tracking-wide",
              "overflow-hidden whitespace-nowrap transition-[width,opacity] duration-500",
              {
                "lg:invisible lg:w-0 lg:pl-0 lg:opacity-0 lg:group-hover/sidebar:visible lg:group-hover/sidebar:w-auto lg:group-hover/sidebar:pl-2 lg:group-hover/sidebar:opacity-100":
                  isCompact,
              },
            )}
          >
            Z-NEWS
          </h1>
        </div>

        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-md",
            "hover:bg-muted/80 transition-all duration-200 active:scale-95",
            "text-muted-foreground hover:text-foreground",
            "lg:hidden",
          )}
          aria-label="Close navigation"
        >
          <X size={18} />
        </button>
      </header>

      {/* Navigation Content */}
      <nav
        className={cn(
          "flex-1 overflow-x-hidden overflow-y-auto",
          "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted",
          "px-4 py-6",
        )}
      >
        {/* Add your navigation items here */}
        <div className="space-y-2">
          {menus.map((menu, i) => (
            <MenuItem key={i} index={i} item={menu} />
          ))}
        </div>
      </nav>
    </div>
  );
});

Sidebar.displayName = "Sidebar";

export default Sidebar;

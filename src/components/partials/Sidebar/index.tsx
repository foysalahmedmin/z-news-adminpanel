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

  console.log(menus);

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Header */}
      <header
        className={cn(
          "bg-card/50 flex h-16 items-center justify-between border-b px-4 backdrop-blur-sm",
          {
            "lg:justify-between": isCompact,
          },
        )}
      >
        {/* Logo Section */}
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex-shrink-0">
            <img
              className="h-8 w-8 rounded-md"
              src="/logo.png"
              alt="Z-News Logo"
              loading="lazy"
            />
          </div>
          <h1
            className={cn(
              "text-foreground text-lg font-bold tracking-wide",
              "overflow-hidden whitespace-nowrap transition-all duration-500",
              {
                "lg:w-0 lg:opacity-0 lg:group-hover/sidebar:w-auto lg:group-hover/sidebar:opacity-100":
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

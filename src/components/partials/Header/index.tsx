import useSetting from "@/hooks/states/useSetting";
import { cn } from "@/lib/utils";
import {
  AlignLeft,
  AlignRight,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import React, { memo } from "react";

interface HeaderProps {
  className?: string;
  isMobileOpen: boolean;
  onToggleMobile: () => void;
}

const Header: React.FC<HeaderProps> = memo(
  ({ className, isMobileOpen, onToggleMobile }) => {
    const { setting, toggleSidebar } = useSetting();
    const isRtl = setting.direction === "rtl";
    const isCompact = setting.sidebar === "compact";

    const getDesktopIcon = () => {
      if (isCompact) {
        return isRtl ? (
          <PanelLeftClose size={20} />
        ) : (
          <PanelLeftOpen size={20} />
        );
      }
      return isRtl ? <AlignRight size={20} /> : <AlignLeft size={20} />;
    };

    const getMobileIcon = () => {
      if (isMobileOpen) {
        return <Menu size={20} />;
      }
      return <Menu size={20} />;
    };

    return (
      <header
        className={cn(
          "sticky top-0 z-30 flex items-center justify-between",
          "bg-card h-16 lg:px-6",
          "border-border border-b",
          className,
        )}
      >
        <div className="flex items-center gap-4">
          {/* Desktop Sidebar Toggle */}
          <button
            onClick={toggleSidebar}
            className={cn(
              "hidden h-9 w-9 items-center justify-center rounded-lg lg:flex",
              "hover:bg-muted/80 transition-all duration-200 active:scale-95",
              "text-muted-foreground hover:text-foreground",
              "focus:ring-primary/20 focus:ring-2 focus:outline-none",
            )}
            aria-label={isCompact ? "Expand sidebar" : "Collapse sidebar"}
          >
            {getDesktopIcon()}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={onToggleMobile}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg lg:hidden",
              "hover:bg-muted/80 transition-all duration-200 active:scale-95",
              "text-muted-foreground hover:text-foreground",
              "focus:ring-primary/20 focus:ring-2 focus:outline-none",
            )}
            aria-label={isMobileOpen ? "Close menu" : "Open menu"}
          >
            {getMobileIcon()}
          </button>
        </div>

        {/* Header Content - Add your header items here */}
        <div className="flex items-center gap-4">
          {/* Placeholder for header content */}
        </div>
      </header>
    );
  },
);

Header.displayName = "Header";

export default Header;

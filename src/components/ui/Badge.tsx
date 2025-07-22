import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import React from "react";

const Badge: React.FC<ComponentProps<"span">> = ({ className }) => {
  return (
    <span
      className={cn(
        "bg-primary text-primary-foreground inline-flex items-center rounded-full px-2 py-1",
        className,
      )}
    />
  );
};

export default Badge;

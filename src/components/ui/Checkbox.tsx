import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import type { ComponentProps } from "react";
import React from "react";

type CheckboxProps = ComponentProps<"input"> & {
  checked?: boolean;
  onChange?: () => void;
  disabled?: boolean;
};

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  disabled = false,
}) => (
  <div
    onClick={disabled ? undefined : onChange}
    className={cn(
      "flex h-5 w-5 items-center justify-center rounded border-2 transition-colors",
      checked ? "border-accent bg-accent" : "border-foreground",
      !disabled && "hover:border-accent/75",
    )}
  >
    {checked && <Check size={16} className="text-accent-foreground" />}
  </div>
);

export { Checkbox };

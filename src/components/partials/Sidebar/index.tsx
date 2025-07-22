import useSetting from "@/hooks/states/useSetting";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import React from "react";

type Props = {
  className?: string;
  toggler: () => void;
};

const Sidebar: React.FC<Props> = ({ className, toggler }) => {
  const { setting } = useSetting();
  return (
    <div className={cn("relative", className)}>
      <div
        className={cn("sticky top-0 h-16 border-b px-4 lg:px-6", {
          "lg:px-0 lg:group-hover:px-6": setting.sidebar === "compact",
        })}
      >
        <div
          className={cn("flex size-full items-center justify-between", {
            "lg:justify-center lg:group-hover:justify-between":
              setting.sidebar === "compact",
          })}
        >
          <div className="flex items-center gap-2">
            <img className="size-8" src="/logo.png" alt="" />
            <h1
              className={cn(
                "text-lg font-semibold whitespace-nowrap uppercase",
                {
                  "lg:hidden lg:group-hover:block":
                    setting.sidebar === "compact",
                },
              )}
            >
              Z-News
            </h1>
          </div>
          <button
            onClick={() => toggler()}
            className="cursor-pointer lg:hidden"
          >
            <X />
          </button>
        </div>
      </div>
      <div className={cn("px-6")}></div>
    </div>
  );
};

export default Sidebar;

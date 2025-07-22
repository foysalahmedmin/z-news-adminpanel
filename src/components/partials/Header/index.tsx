import useSetting from "@/hooks/states/useSetting";
import { cn } from "@/lib/utils";
import { AlignLeft, AlignRight, MoveLeft, MoveRight } from "lucide-react";
import React from "react";

type Props = {
  className?: string;
  isOpen?: boolean;
  toggler: () => void;
};
const Header: React.FC<Props> = ({ className, isOpen, toggler }) => {
  const { setting, toggleSidebar } = useSetting();
  return (
    <div
      className={cn("flex size-full items-center justify-between", className)}
    >
      <div className="flex h-full items-center">
        <button
          onClick={() => toggleSidebar()}
          className="hidden cursor-pointer lg:inline-block"
        >
          {setting.sidebar === "compact" ? (
            <>{setting.direction === "ltr" ? <MoveRight /> : <MoveLeft />}</>
          ) : (
            <>{setting.direction === "ltr" ? <AlignLeft /> : <AlignRight />}</>
          )}
        </button>
        <button
          onClick={() => toggler()}
          className="inline-block cursor-pointer lg:hidden"
        >
          {!isOpen ? (
            <>{setting.direction === "ltr" ? <MoveRight /> : <MoveLeft />}</>
          ) : (
            <>{setting.direction === "ltr" ? <AlignLeft /> : <AlignRight />}</>
          )}
        </button>
      </div>
    </div>
  );
};

export default Header;

import { BellIcon } from "lucide-react";
import React from "react";

const Notification: React.FC = () => {
  return (
    <div className="flex h-full items-center">
      <div className="relative">
        <BellIcon className="size-6 cursor-pointer" />
        <span className="bg-accent text-accent-foreground absolute top-0.5 right-0.5 inline-flex h-4 min-w-4 translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full text-xs">
          0
        </span>
      </div>
    </div>
  );
};

export default Notification;

import { Loader2 } from "lucide-react";
import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center lg:min-h-[calc(100vh-80px)]">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
};

export default Loader;

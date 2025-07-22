import Header from "@/components/partials/Header";
import Sidebar from "@/components/partials/Sidebar";
import useSetting from "@/hooks/states/useSetting";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Outlet } from "react-router";

const CommonLayout = () => {
  const { setting } = useSetting();
  const [isOpen, setIsOpen] = useState(true);

  const toggler = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <div className="relative z-50 lg:z-0">
        <div
          className={cn(
            "invisible fixed inset-0 bg-black/25 opacity-0 transition-[opacity,transform] duration-500 lg:-z-50",
            {
              "visible z-50 opacity-100 lg:invisible lg:-z-50 lg:opacity-0":
                isOpen,
            },
          )}
        />
        <aside
          className={cn(
            "bg-card group text-card-foreground z-50 h-screen overflow-x-hidden overflow-y-auto transition-[width] duration-500",
            "absolute w-screen max-w-80 translate-x-0 lg:relative lg:w-80 lg:border-r",
            {
              "lg:w-16 lg:hover:w-80": setting.sidebar === "compact",
              "-translate-x-full lg:translate-x-0": !isOpen,
            },
          )}
        >
          <Sidebar toggler={toggler} />
        </aside>
      </div>
      <div className="relative z-0 flex h-screen flex-1 flex-col overflow-x-hidden overflow-y-auto">
        <header className="bg-card text-card-foreground sticky top-0 h-16 w-full border-b px-4 lg:px-6">
          <Header isOpen={isOpen} toggler={toggler} />
        </header>
        <main className="flex-1 px-4 py-6 lg:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CommonLayout;

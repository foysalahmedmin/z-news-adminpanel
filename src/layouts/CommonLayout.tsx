import Header from "@/components/partials/Header";
import Sidebar from "@/components/partials/Sidebar";
import { cn } from "@/lib/utils";
import { Outlet } from "react-router";

const CommonLayout = () => {
  return (
    <div className="flex h-screen w-screen gap-6">
      <aside
        className={cn(
          "bg-card text-card-foreground w-96 overflow-x-hidden overflow-y-auto lg:border-r",
        )}
      >
        <Sidebar />
      </aside>
      <div className="relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
        <header className="bg-card text-card-foreground sticky top-0 h-16 w-full border-b px-8">
          <Header />
        </header>
        <main className="flex-1 px-8 py-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CommonLayout;

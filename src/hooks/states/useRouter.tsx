// src/router/Router.ts
import { items } from "@/assets/data/route-menu-items";
import { RouteMenu } from "@/builder/RouteMenu";
import RootLayout from "@/layouts/RootLayout";
import ErrorPage from "@/pages/(partial)/ErrorPage";
import { useMemo } from "react";
import { createBrowserRouter } from "react-router";
import useUser from "./useUser";

const useAppRouter = () => {
  const { user } = useUser();
  const { info } = user || {};

  const routesData = useMemo(() => {
    const routeMenu = new RouteMenu(items);
    return routeMenu.getRoutes({ role: info?.role });
  }, [info?.role]);

  const { routes } = routesData || {};

  const router = useMemo(
    () =>
      createBrowserRouter([
        {
          path: "/",
          element: <RootLayout />,
          errorElement: <ErrorPage />,
          children: routes || [],
        },
      ]),
    [routes],
  );

  return router;
};

export default useAppRouter;

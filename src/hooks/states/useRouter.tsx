// src/router/Router.ts
import { items } from "@/assets/data/route-menu-items";
import { RouteMenu } from "@/builder/RouteMenu";
import RootLayout from "@/layouts/RootLayout";
import ErrorPage from "@/pages/(partial)/ErrorPage";
import { useMemo } from "react";
import { createBrowserRouter } from "react-router";

const useAppRouter = () => {
  const routeMenu = new RouteMenu(items);
  const { routes } = routeMenu.getRoutes();

  console.log(routes);

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

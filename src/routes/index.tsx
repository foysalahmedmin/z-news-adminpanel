import RootLayout from "@/layouts/RootLayout";
import ErrorPage from "@/pages/(partial)/ErrorPage";
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { createBrowserRouter } from "react-router";

export const Router = () => {
  const routes = useSelector((state: RootState) => state.route_menu.routes);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: routes || [],
    },
  ]);

  return router;
};

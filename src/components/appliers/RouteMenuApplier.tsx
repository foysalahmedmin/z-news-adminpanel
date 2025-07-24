// app/components/RouteMenuApplier.tsx

import { items } from "@/assets/data/route-menu-items";
import { RouteMenu } from "@/builder/RouteMenu";
import {
  setBreadcrumbs,
  setIndexes,
  setMenus,
  setRoutes,
} from "@/redux/slices/route-menu-slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const RouteMenuApplier = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const routeMenu = new RouteMenu(items);

    const { routes } = routeMenu.getRoutes();
    const { menus, indexes, breadcrumbs } = routeMenu.getMenus();

    dispatch(setMenus(menus));
    dispatch(setRoutes(routes));
    dispatch(setIndexes(indexes));
    dispatch(setBreadcrumbs(breadcrumbs));
  }, [dispatch]);

  return null;
};

export default RouteMenuApplier;

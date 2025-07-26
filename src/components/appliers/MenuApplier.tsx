import { items } from "@/assets/data/route-menu-items";
import { RouteMenu } from "@/builder/RouteMenu";
import {
  setBreadcrumbs,
  setIndexes,
  setMenus,
} from "@/redux/slices/menu-slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const MenuApplier = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const routeMenu = new RouteMenu(items);
    const { menus, indexes, breadcrumbs } = routeMenu.getMenus();

    dispatch(setMenus(menus));
    dispatch(setIndexes(indexes));
    dispatch(setBreadcrumbs(breadcrumbs));
  }, [dispatch]);

  return null;
};

export default MenuApplier;

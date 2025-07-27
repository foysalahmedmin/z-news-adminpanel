import { items } from "@/assets/data/route-menu-items";
import { RouteMenu } from "@/builder/RouteMenu";
import {
  setActiveBreadcrumb,
  setActiveIndexPath,
  setBreadcrumbs,
  setIndexes,
  setMenus,
  setOpenIndexPath,
} from "@/redux/slices/menu-slice";
import type { RootState } from "@/redux/store";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

const MenuApplier = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { indexes, breadcrumbs } = useSelector(
    (state: RootState) => state.menu,
  );

  const menusData = useMemo(() => {
    const routeMenu = new RouteMenu(items);
    return routeMenu.getMenus();
  }, []);

  useEffect(() => {
    if (!indexes || Object.keys(indexes).length === 0) {
      const { menus, indexes, breadcrumbs } = menusData;
      dispatch(setMenus(menus));
      dispatch(setIndexes(indexes));
      dispatch(setBreadcrumbs(breadcrumbs));
    }
  }, [dispatch, menusData, indexes]);

  useEffect(() => {
    if (pathname && indexes) {
      dispatch(setActiveIndexPath(indexes[pathname]));
      dispatch(setOpenIndexPath(indexes[pathname]));
      dispatch(setActiveBreadcrumb(breadcrumbs[pathname]));
    }
  }, [pathname, indexes, breadcrumbs, dispatch]);

  return null;
};

export default MenuApplier;

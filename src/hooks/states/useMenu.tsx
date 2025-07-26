import { setActiveIndex as setActiveIndexSlice } from "@/redux/slices/menu-slice";
import type { RootState } from "@/redux/store";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

const useMenu = () => {
  const dispatch = useDispatch();
  const { menus, indexes, breadcrumbs, activeIndex, activeBreadcrumb } =
    useSelector((state: RootState) => state.menu);

  const setActiveIndex = useCallback(
    (payload: number[]) => dispatch(setActiveIndexSlice(payload)),
    [dispatch],
  );

  return {
    menus,
    indexes,
    breadcrumbs,
    activeIndex,
    activeBreadcrumb,
    setActiveIndex,
  };
};

export default useMenu;

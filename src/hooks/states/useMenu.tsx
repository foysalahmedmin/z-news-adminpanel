import { setOpenIndexPath as setOpenIndexPathSlice } from "@/redux/slices/menu-slice";
import type { RootState } from "@/redux/store";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

const useMenu = () => {
  const dispatch = useDispatch();
  const {
    menus,
    indexes,
    breadcrumbs,
    activeIndexPath,
    openIndexPath,
    activeBreadcrumb,
  } = useSelector((state: RootState) => state.menu);

  const setOpenIndexPath = useCallback(
    (payload: number[]) => dispatch(setOpenIndexPathSlice(payload)),
    [dispatch],
  );

  return {
    menus,
    indexes,
    breadcrumbs,
    activeIndexPath,
    openIndexPath,
    activeBreadcrumb,
    setOpenIndexPath,
  };
};

export default useMenu;

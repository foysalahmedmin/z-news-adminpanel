import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const useMenu = () => {
  const { menus, indexes, breadcrumbs } = useSelector(
    (state: RootState) => state.menu,
  );

  return { menus, indexes, breadcrumbs };
};

export default useMenu;

// store/routeSlice.ts

import type { TMenuState } from "@/types/state.type";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const initialState: TMenuState = {
  menus: [],
  indexes: {},
  breadcrumbs: {},
  activeIndexPath: [],
  openIndexPath: [],
  activeBreadcrumb: [],
};

const routeSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setMenus(state, action: PayloadAction<TMenuState["menus"]>) {
      state.menus = action.payload;
    },
    setIndexes(state, action: PayloadAction<TMenuState["indexes"]>) {
      state.indexes = action.payload;
    },
    setBreadcrumbs(state, action: PayloadAction<TMenuState["breadcrumbs"]>) {
      state.breadcrumbs = action.payload;
    },
    setActiveIndexPath(
      state,
      action: PayloadAction<TMenuState["activeIndexPath"]>,
    ) {
      state.activeIndexPath = action.payload;
    },
    setOpenIndexPath(
      state,
      action: PayloadAction<TMenuState["openIndexPath"]>,
    ) {
      state.openIndexPath = action.payload;
    },
    setActiveBreadcrumb(
      state,
      action: PayloadAction<TMenuState["activeBreadcrumb"]>,
    ) {
      state.activeBreadcrumb = action.payload;
    },
  },
});

export const {
  setMenus,
  setIndexes,
  setBreadcrumbs,
  setActiveIndexPath,
  setOpenIndexPath,
  setActiveBreadcrumb,
} = routeSlice.actions;
export default routeSlice.reducer;

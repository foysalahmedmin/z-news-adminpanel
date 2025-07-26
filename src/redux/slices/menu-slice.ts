// store/routeSlice.ts

import type { TRouteMenuState } from "@/types/state.type";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const initialState: TRouteMenuState = {
  menus: [],
  indexes: {},
  breadcrumbs: {},
};

const routeSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setMenus(state, action: PayloadAction<TRouteMenuState["menus"]>) {
      state.menus = action.payload;
    },
    setIndexes(state, action: PayloadAction<TRouteMenuState["indexes"]>) {
      state.indexes = action.payload;
    },
    setBreadcrumbs(
      state,
      action: PayloadAction<TRouteMenuState["breadcrumbs"]>,
    ) {
      state.breadcrumbs = action.payload;
    },
  },
});

export const { setMenus, setIndexes, setBreadcrumbs } = routeSlice.actions;
export default routeSlice.reducer;

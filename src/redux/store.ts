import { configureStore } from "@reduxjs/toolkit";
import routeMenuReducer from "./slices/menu-slice";
import settingReducer from "./slices/setting-slice";
import userReducer from "./slices/user-slice";

export const store = configureStore({
  reducer: {
    menu: routeMenuReducer,
    setting: settingReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

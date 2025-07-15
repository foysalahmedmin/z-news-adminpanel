import type { UserState } from "@/types/state.type";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const getInitialUser = (): UserState => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : { isAuthenticated: false };
  } catch (error) {
    console.error("Error parsing user from localStorage", error);
    return { isAuthenticated: false };
  }
};

const initialState: UserState = getInitialUser();

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      const user = action.payload;
      if (user?.accessToken) {
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, isAuthenticated: true }),
        );
        return { ...user, isAuthenticated: true };
      }
      return state;
    },
    clearUser: () => {
      localStorage.removeItem("user");
      return { isAuthenticated: false };
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

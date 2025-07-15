import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const initialState: string =
  (localStorage.getItem("language") as string) || "en";

export const userSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      const language = action.payload;
      if (language) {
        localStorage.setItem("language", language);
        return language;
      }
      return state;
    },
  },
});

export const { setLanguage } = userSlice.actions;
export default userSlice.reducer;

import type { TUser } from "./user.type";

export type TUserState = {
  token?: string;
  info?: TUser;
  isAuthenticated?: boolean;
};

export type TSettingState = {
  theme?: "light" | "dark" | "system" | "semi-dark";
  direction?: "ltr" | "rtl";
  language?: "en" | "bn";
  sidebar?: "full" | "compact";
  header?: "full" | "compact";
  layout?: "vertical" | "horizontal";
};

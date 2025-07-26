import type { IBreadcrumb, IProcessedMenu } from "./route-menu.type";
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
  sidebar?: "expanded" | "compact";
  header?: "expanded" | "compact";
  layout?: "vertical" | "horizontal";
};

export type TRouteMenuState = {
  menus: IProcessedMenu[];
  indexes: Record<string, number[]>;
  breadcrumbs: Record<string, IBreadcrumb[]>;
};

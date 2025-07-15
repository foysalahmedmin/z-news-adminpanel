import type { TUser } from "./user.type";

export interface UserState {
  token?: string;
  info?: TUser;
  isAuthenticated?: boolean;
  [key: string]: unknown;
}

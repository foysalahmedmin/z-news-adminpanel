import type { TUser } from "./user.type";

export type Response<T = unknown> = {
  success?: boolean;
  message?: string;
  status?: number;
  data?: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
};

export type AuthResponse = Omit<Response, "data"> & {
  data?: {
    token?: string;
    info?: TUser;
  };
};

export type TRole =
  | "super-admin"
  | "admin"
  | "editor"
  | "author"
  | "contributor"
  | "subscriber"
  | "user";

export type TStatus = "in-progress" | "blocked";

export type TUser = {
  _id: string;
  name: string;
  email: string;
  password?: string;
  password_changed_at?: Date;
  role: TRole;
  status: TStatus;
  is_verified?: boolean;
};

export type TUserResponse = Omit<Response, "data"> & {
  data?: TUser;
};

export type TUsersResponse = Omit<Response, "data"> & {
  data?: TUser[];
};

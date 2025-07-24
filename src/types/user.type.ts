export type TUser = {
  _id: string;
  name: string;
  image?: string;
  email: string;
  role?: string;
  [key: string]: unknown;
};

export type TUserResponse = Omit<Response, "data"> & {
  data?: TUser;
};

export type TUsersResponse = Omit<Response, "data"> & {
  data?: TUser[];
};

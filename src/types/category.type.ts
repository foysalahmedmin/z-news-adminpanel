export type TStatus = "active" | "inactive";

export type TCategory = {
  _id: string;
  name: string;
  slug: string;
  sequence: number;
  status: TStatus;
  children?: TCategory[];
};

export type TCategoryResponse = Omit<Response, "data"> & {
  data?: TCategory;
};

export type TCategoriesResponse = Omit<Response, "data"> & {
  data?: TCategory[];
};

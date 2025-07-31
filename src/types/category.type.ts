import type { Response } from "./response.type";

export type TStatus = "active" | "inactive";

export type TCategory = {
  _id: string;
  category?: string;
  icon?: string;
  name: string;
  slug: string;
  sequence: number; // To maintain sort order to display
  status: TStatus;
  children?: TCategory[];
};

export type TCategoryCreatePayload = {
  category?: string;
  icon?: string;
  name: string;
  slug: string;
  sequence: number;
  status: TStatus;
};

export type TCategoryUpdatePayload = {
  category?: string;
  icon?: string;
  name?: string;
  slug?: string;
  sequence?: number;
  status?: TStatus;
};

export type TCategoryResponse = Response<TCategory>;
export type TCategoriesResponse = Response<TCategory[]>;

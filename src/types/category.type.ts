import type { Response } from "./response.type";

export type TStatus = "active" | "inactive";

export type TCategory = {
  _id: string;
  category?: string; // (As Parent) When adding a subcategory
  name: string;
  slug: string;
  sequence: number; // To maintain sort order to display
  status: TStatus;
  children?: TCategory[];
};

export type TCategoryResponse = Response<TCategory>;
export type TCategoriesResponse = Response<TCategory[]>;

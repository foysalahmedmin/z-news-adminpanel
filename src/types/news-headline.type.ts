import type { Response } from "./response.type";

export type TStatus = "draft" | "pending" | "published" | "archived";

export type TNewsHeadline = {
  _id: string;
  sequence: number;
  news: string;
  status: TStatus;
  published_at?: Date;
  expired_at?: Date;
};

export type TNewsHeadlineResponse = Response<TNewsHeadline>;
export type TNewsHeadlinesResponse = Response<TNewsHeadline[]>;

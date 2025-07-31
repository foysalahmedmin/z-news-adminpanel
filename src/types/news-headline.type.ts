import type { Response } from "./response.type";

export type TStatus = "draft" | "pending" | "published" | "archived";

export type TNewsHeadline = {
  _id: string;
  sequence: number;
  title: string;
  summary?: string;
  tags?: string[];
  category: string;
  author: string;
  news?: string;
  status: TStatus;
  published_at?: Date;
  expired_at?: Date;
  is_edited?: boolean;
  edited_at?: Date;
};

export type TNewsHeadlineResponse = Response<TNewsHeadline>;
export type TNewsHeadlinesResponse = Response<TNewsHeadline[]>;

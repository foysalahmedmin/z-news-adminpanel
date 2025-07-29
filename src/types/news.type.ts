import type { TNewsBreak } from "./news-break.type";
import type { TNewsHeadline } from "./news-headline.type";
import type { Response } from "./response.type";

export type TStatus = "draft" | "pending" | "published" | "archived";

export type TNews = {
  _id: string;
  sequence: number;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  thumbnail?: string;
  images?: string[];
  tags?: string[];
  category: string;
  author: string;
  status: TStatus;
  is_featured: boolean;
  is_premium: boolean;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  published_at?: Date;
  expired_at?: Date;
  is_edited?: boolean;
  edited_at?: Date;
  is_deleted: boolean;
  news_headline?: TNewsHeadline;
  news_break?: TNewsBreak;
};

export type TNewsResponse = Omit<Response, "data"> & {
  data?: TNews;
};

export type TBulkNewsResponse = {
  data?: TNews[];
};

import type { Response } from "./response.type";

export type TStatus = "draft" | "pending" | "published" | "archived";

export type TNews = {
  _id: string;
  sequence: number;
  title: string;
  slug: string;
  caption?: string;
  description?: string;
  content: string;
  thumbnail?: string;
  images?: string[];
  video?: string;
  youtube?: string;
  tags?: string[];
  category: {
    _id: string;
    name: string;
  };
  author: {
    _id: string;
    name: string;
  };
  writer?: string;
  layout?: "default" | "standard" | "featured" | "minimal";
  status?: TStatus;
  is_featured: boolean;
  is_premium: boolean;
  seo?: {
    image?: string;
    title?: string;
    description?: string;
    keywords?: string[];
  };
  published_at?: Date;
  expired_at?: Date;
  is_edited?: boolean;
  edited_at?: Date;
  is_news_headline?: boolean;
  is_news_break?: boolean;
  // news_headline?: Partial<TNewsHeadline>;
  // news_break?: Partial<TNewsBreak>;
  created_at?: string;
  updated_at?: string;
};

export type TCreateNewsPayload = {
  sequence?: number;
  title: string;
  slug: string;
  caption?: string;
  description?: string;
  content: string; // html string
  thumbnail?: File | null;
  images?: File[] | null;
  video?: File | null;
  youtube?: string;
  tags?: string[];
  category: string;
  writer?: string;
  layout?: "default" | "standard" | "featured" | "minimal";
  status?: "draft" | "published";
  is_featured: boolean;
  seo?: {
    image?: File | null;
    title?: string;
    description?: string;
    keywords?: string[];
  };
  published_at?: Date;
  expired_at?: Date;
  is_news_headline?: boolean;
  is_news_break?: boolean;
};

export type TUpdateNewsPayload = {
  sequence?: number;
  title?: string;
  slug?: string;
  caption?: string;
  description?: string;
  content?: string;
  thumbnail?: File | null | string;
  images?: File[] | null | string[];
  video?: File | null | string;
  youtube?: string;
  tags?: string[];
  category?: string;
  writer?: string;
  layout?: "default" | "standard" | "featured" | "minimal";
  status?: TStatus;
  is_featured?: boolean;
  seo?: {
    image?: File | null | string;
    title?: string;
    description?: string;
    keywords?: string[];
  };
  published_at?: string | Date;
  expired_at?: string | Date;
  is_news_headline?: boolean;
  is_news_break?: boolean;
};

export type TBulkUpdatePayload = {
  ids: string[];
  status?: TStatus;
};

export type TNewsFileResponse = Response<{
  type: "image" | "video" | "audio" | "file";
  filename: string;
  path: string;
  url: string;
}>;
export type TNewsResponse = Response<TNews>;
export type TBulkNewsResponse = Response<TNews[]>;

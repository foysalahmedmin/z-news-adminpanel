import type { TNewsBreak } from "./news-break.type";
import type { TNewsHeadline } from "./news-headline.type";
import type { Response } from "./response.type";

export type TStatus = "draft" | "pending" | "published" | "archived";

export type TNews = {
  _id: string;
  sequence: number;
  title: string;
  slug: string;
  description?: string;
  content: string;
  thumbnail?: string;
  images?: string[];
  tags?: string[];
  category: {
    _id: string;
    name: string;
  };
  author: {
    _id: string;
    name: string;
  };
  layout?: "default" | "standard" | "featured" | "minimal";
  status?: TStatus;
  is_top_featured: boolean;
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
  news_headline?: Partial<TNewsHeadline>;
  news_break?: Partial<TNewsBreak>;
};

export type TCreateNewsPayload = {
  sequence?: number;
  title: string;
  slug: string;
  description?: string;
  content: string; // html string
  thumbnail?: File | null;
  images?: File[] | null;
  tags?: string[];
  category: string;
  author: string;
  layout?: "default" | "standard" | "featured" | "minimal";
  status?: "draft" | "published";
  is_top_featured: boolean;
  is_featured: boolean;
  is_premium: boolean;
  seo?: {
    image?: File | null;
    title?: string;
    description?: string;
    keywords?: string[];
  };
  published_at?: Date;
  expired_at?: Date;
  // news_headline?: Partial<TNewsHeadline>;
  // news_break?: Partial<TNewsBreak>;
};

export type TUpdateNewsPayload = {
  sequence?: number;
  title?: string;
  slug?: string;
  description?: string;
  content?: string;
  thumbnail?: File | null;
  images?: File[] | null;
  tags?: string[];
  category?: string;
  layout?: "default" | "standard" | "featured" | "minimal";
  status?: TStatus;
  is_top_featured?: boolean;
  is_featured?: boolean;
  is_premium?: boolean;
  seo?: {
    image?: File | null;
    title?: string;
    description?: string;
    keywords?: string[];
  };
  published_at?: string | Date;
  expired_at?: string | Date;
};

export type TBulkUpdatePayload = {
  ids: string[];
  status?: TStatus;
};

export type TNewsResponse = Response<TNews>;
export type TBulkNewsResponse = Response<TNews[]>;

import type { Response } from "./response.type";

export type TStatus = "draft" | "pending" | "published" | "archived";

export type TFile = {
  _id: string;
  url: string;
  name: string;
  path: string;
  file_name: string;
  type: string;
  caption?: string;
  size?: number;
  author?: {
    _id: string;
    name: string;
    email: string;
    image?: string;
  };
};

export type TNews = {
  _id: string;
  title: string;
  sub_title?: string;
  slug: string;
  description?: string;
  content: string;
  thumbnail?: TFile;
  video?: TFile;
  youtube?: string;
  tags?: string[];
  event?: {
    _id: string;
    name: string;
    slug: string;
  };
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  categories?: {
    _id: string;
    name: string;
    slug: string;
  }[];
  author: {
    _id: string;
    name: string;
    email: string;
    image?: string;
  };
  writer?: string;
  layout?: "default" | "standard" | "featured" | "minimal";
  status?: TStatus;
  is_featured: boolean;
  published_at?: Date;
  expired_at?: Date;
  is_edited?: boolean;
  edited_at?: Date;
  created_at?: string;
  updated_at?: string;
  news_headline?: {
    _id: string;
    status: TStatus;
    published_at?: Date;
    expired_at?: Date;
  };
  news_break?: {
    _id: string;
    status: TStatus;
    published_at?: Date;
    expired_at?: Date;
  };
  is_news_headline?: boolean;
  is_news_break?: boolean;
  views?: number;
  likes?: number;
  dislikes?: number;
  comments?: number;
};

export type TCreateNewsPayload = {
  title: string;
  sub_title?: string;
  slug: string;
  description?: string;
  content: string; // html string
  thumbnail?: string | null; // File ObjectId
  video?: string | null; // File ObjectId
  youtube?: string;
  tags?: string[];
  event?: string;
  category?: string;
  categories?: string[];
  writer?: string;
  layout?: string;
  status?: TStatus;
  is_featured?: boolean;
  published_at?: Date;
  expired_at?: Date;
  is_news_headline?: boolean;
  is_news_break?: boolean;
  headline_status?: TStatus;
  headline_published_at?: Date;
  headline_expired_at?: Date;
  break_status?: TStatus;
  break_published_at?: Date;
  break_expired_at?: Date;
};

export type TUpdateNewsPayload = {
  title?: string;
  sub_title?: string;
  slug?: string;
  description?: string;
  content?: string;
  thumbnail?: string | null; // File ObjectId
  video?: string | null; // File ObjectId
  youtube?: string;
  tags?: string[];
  event?: string;
  category?: string;
  categories?: string[];
  writer?: string;
  layout?: string;
  status?: TStatus;
  is_featured?: boolean;
  published_at?: string | Date;
  expired_at?: string | Date;
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

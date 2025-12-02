import type { Response } from "./response.type";

export type TStatus = "draft" | "pending" | "published" | "archived";

export type TNews = {
  _id: string;
  title: string;
  sub_title?: string;
  slug: string;
  description?: string;
  content: string;
  thumbnail?: {
    _id: string;
    url: string;
    name: string;
  };
  video?: {
    _id: string;
    url: string;
    name: string;
  };
  youtube?: string;
  tags?: string[];
  event?: {
    _id: string;
    name: string;
  };
  category: {
    _id: string;
    name: string;
  };
  categories?: {
    _id: string;
    name: string;
  }[];
  author: {
    _id: string;
    name: string;
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
};

export type TCreateNewsPayload = {
  title: string;
  sub_title?: string;
  slug: string;
  description?: string;
  content: string; // html string
  thumbnail?: string; // File ObjectId
  video?: string; // File ObjectId
  youtube?: string;
  tags?: string[];
  event?: string;
  category: string;
  categories?: string[];
  writer?: string;
  layout?: "default" | "standard" | "featured" | "minimal";
  status?: "draft" | "published";
  is_featured: boolean;
  published_at?: Date;
  expired_at?: Date;
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
  layout?: "default" | "standard" | "featured" | "minimal";
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

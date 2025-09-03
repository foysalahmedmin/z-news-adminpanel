// comment.type.ts

import type { Response } from "./response.type";

export type TCommentStatus = "pending" | "approved" | "rejected";

export type TComment = {
  _id: string;
  news: string;
  comment?: string;
  name: string;
  email: string;
  content: string;
  status: TCommentStatus;
  createdAt: string;
  updatedAt: string;
  deleted?: boolean;
  deletedAt?: string;
};

export type TCreateCommentPayload = {
  news: string;
  comment?: string;
  name: string;
  email: string;
  content: string;
};

export type TUpdateSelfCommentPayload = {
  name: string;
  email: string;
  content?: string;
};

export type TUpdateCommentPayload = {
  content?: string;
  status?: TCommentStatus;
};

export type TBulkUpdateCommentPayload = {
  ids: string[];
  status?: TCommentStatus;
};

export type TCommentResponse = Response<TComment>;
export type TCommentsResponse = Response<TComment[]>;

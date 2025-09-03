import type { Response } from "./response.type";

export type TReactionType = "like" | "dislike";
export type TReactionStatus = "pending" | "approved" | "rejected";

export type TReaction = {
  _id: string;
  news: string;
  user: string;
  type: TReactionType;
  status: TReactionStatus;
  createdAt: string;
  updatedAt: string;
};

export type TCreateReactionPayload = {
  news: string;
  type: TReactionType;
};

export type TUpdateSelfReactionPayload = {
  type: TReactionType;
};

export type TUpdateReactionPayload = {
  type?: TReactionType;
  status?: TReactionStatus;
};

export type TBulkUpdateReactionPayload = {
  ids: string[];
  status?: TReactionStatus;
};

export type TReactionResponse = Response<TReaction>;
export type TReactionsResponse = Response<TReaction[]>;

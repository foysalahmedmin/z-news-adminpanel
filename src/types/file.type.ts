import type { Response } from "./response.type";

export type TFileType = "image" | "video" | "audio" | "file" | "pdf" | "doc" | "txt";
export type TFileStatus = "active" | "inactive" | "archived";

export type TFile = {
  _id: string;
  file_name: string;
  name: string;
  url: string;
  path: string;
  type: TFileType;
  mime_type: string;
  size: number;
  extension: string;
  author: {
    _id: string;
    name: string;
    email: string;
    image?: string;
  };
  category?: string;
  description?: string;
  caption?: string;
  status: TFileStatus;
  created_at?: string;
  updated_at?: string;
};

export type TFileCreatePayload = {
  name?: string;
  category?: string;
  description?: string;
  caption?: string;
  status?: TFileStatus;
  file: File;
};

export type TFileUpdatePayload = {
  name?: string;
  category?: string;
  description?: string;
  caption?: string;
  status?: TFileStatus;
};

export type TFileResponse = Response<TFile>;
export type TFilesResponse = Response<TFile[]>;


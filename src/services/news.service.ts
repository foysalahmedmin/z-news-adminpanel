import { FormDataConverterFactory } from "@/builder/ObjectFormData";
import api from "@/lib/api";
import type {
  TBulkNewsResponse,
  TBulkUpdatePayload,
  TCreateNewsPayload,
  TNewsFileResponse,
  TNewsResponse,
  TUpdateNewsPayload,
} from "@/types/news.type";

// Create converter instance
const formDataConverter = FormDataConverterFactory.createObjectToFormData();

// ========================= GET =========================
export async function fetchSelfBulkNews(
  query?: Record<string, any>,
): Promise<TBulkNewsResponse> {
  const response = await api.get("/api/news/self", { params: query });
  return response.data;
}

export async function fetchBulkNews(
  query?: Record<string, any>,
): Promise<TBulkNewsResponse> {
  const response = await api.get("/api/news", { params: query });
  return response.data;
}

export async function fetchSelfNews(id: string): Promise<TNewsResponse> {
  const response = await api.get(`/api/news/${id}/self`);
  return response.data;
}

export async function fetchNews(id: string): Promise<TNewsResponse> {
  const response = await api.get(`/api/news/${id}`);
  return response.data;
}

// ========================= POST =========================
export async function uploadNewsFile(
  file: File,
  type: "image" | "video" | "audio" | "file" = "image",
): Promise<TNewsFileResponse> {
  if (!file || !type) return Promise.reject();

  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post(`/api/news/file/${type}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function createNews(
  payload: TCreateNewsPayload,
): Promise<TNewsResponse> {
  const response = await api.post(
    "/api/news",
    formDataConverter.convert(payload),
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response.data;
}

export async function restoreSelfBulkNews(payload: {
  ids: string[];
}): Promise<TBulkNewsResponse> {
  const response = await api.post("/api/news/bulk/restore/self", payload);
  return response.data;
}

export async function restoreBulkNews(payload: {
  ids: string[];
}): Promise<TBulkNewsResponse> {
  const response = await api.post("/api/news/bulk/restore", payload);
  return response.data;
}

export async function restoreSelfNews(id: string): Promise<TNewsResponse> {
  const response = await api.post(`/api/news/${id}/restore/self`);
  return response.data;
}

export async function restoreNews(id: string): Promise<TNewsResponse> {
  const response = await api.post(`/api/news/${id}/restore`);
  return response.data;
}

// ========================= PATCH =========================
export async function updateSelfBulkNews(
  payload: TBulkUpdatePayload,
): Promise<TBulkNewsResponse> {
  const response = await api.patch("/api/news/bulk/self", payload);
  return response.data;
}

export async function updateSelfNews(
  id: string,
  payload: TUpdateNewsPayload,
): Promise<TNewsResponse> {
  const response = await api.patch(
    `/api/news/${id}/self`,
    formDataConverter.convert(payload),
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response.data;
}

export async function updateBulkNews(
  payload: TBulkUpdatePayload,
): Promise<TBulkNewsResponse> {
  const response = await api.patch("/api/news/bulk", payload);
  return response.data;
}

export async function updateNews(
  id: string,
  payload: TUpdateNewsPayload,
): Promise<TNewsResponse> {
  const response = await api.patch(
    `/api/news/${id}`,
    formDataConverter.convert(payload),
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response.data;
}

// ========================= DELETE =========================
export async function deleteNewsFile(path: string): Promise<TNewsFileResponse> {
  const response = await api.delete(`/api/news/file/${path}`);
  return response.data;
}

export async function deleteSelfBulkNews(payload: {
  ids: string[];
}): Promise<TBulkNewsResponse> {
  const response = await api.delete("/api/news/bulk/self", { data: payload });
  return response.data;
}

export async function deleteBulkNewsPermanent(payload: {
  ids: string[];
}): Promise<TBulkNewsResponse> {
  const response = await api.delete("/api/news/bulk/permanent", {
    data: payload,
  });
  return response.data;
}

export async function deleteBulkNews(payload: {
  ids: string[];
}): Promise<TBulkNewsResponse> {
  const response = await api.delete("/api/news/bulk", { data: payload });
  return response.data;
}

export async function deleteSelfNews(id: string): Promise<TNewsResponse> {
  const response = await api.delete(`/api/news/${id}/self`);
  return response.data;
}

export async function deleteNewsPermanent(id: string): Promise<TNewsResponse> {
  const response = await api.delete(`/api/news/${id}/permanent`);
  return response.data;
}

export async function deleteNews(id: string): Promise<TNewsResponse> {
  const response = await api.delete(`/api/news/${id}`);
  return response.data;
}

import api from "@/lib/api";
import type { TBulkNewsResponse, TNewsResponse } from "@/types/news.type";

// ========================= GET =========================

// GET Self Bulk News
export async function fetchSelfBulkNews(
  query?: Record<string, any>,
): Promise<TBulkNewsResponse> {
  const response = await api.get("/api/news/self", { params: query });
  return response.data as TBulkNewsResponse;
}

// GET All Bulk News (Admin)
export async function fetchBulkNews(
  query?: Record<string, any>,
): Promise<TBulkNewsResponse> {
  const response = await api.get("/api/news", { params: query });
  return response.data as TBulkNewsResponse;
}

// GET Self Single News
export async function fetchSelfNews(id: string): Promise<TNewsResponse> {
  const response = await api.get(`/api/news/${id}/self`);
  return response.data as TNewsResponse;
}

// GET Single News (Admin)
export async function fetchNews(id: string): Promise<TNewsResponse> {
  const response = await api.get(`/api/news/${id}`);
  return response.data as TNewsResponse;
}

// ========================= POST =========================

// Create News
export async function createNews(
  payload: Record<string, any>,
): Promise<TNewsResponse> {
  const response = await api.post("/api/news", payload);
  return response.data as TNewsResponse;
}

// Restore Bulk Self News
export async function restoreSelfBulkNews(payload: {
  ids: string[];
}): Promise<TBulkNewsResponse> {
  const response = await api.post("/api/news/bulk/restore/self", payload);
  return response.data as TBulkNewsResponse;
}

// Restore Bulk News (Admin)
export async function restoreBulkNews(payload: {
  ids: string[];
}): Promise<TBulkNewsResponse> {
  const response = await api.post("/api/news/bulk/restore", payload);
  return response.data as TBulkNewsResponse;
}

// Restore Single Self News
export async function restoreSelfNews(id: string): Promise<TNewsResponse> {
  const response = await api.post(`/api/news/${id}/restore/self`);
  return response.data as TNewsResponse;
}

// Restore Single News (Admin)
export async function restoreNews(id: string): Promise<TNewsResponse> {
  const response = await api.post(`/api/news/${id}/restore`);
  return response.data as TNewsResponse;
}

// ========================= PATCH =========================

// Update Bulk Self News
export async function updateSelfBulkNews(payload: {
  ids: string[];
  status?: "draft" | "pending" | "published" | "archived";
}): Promise<TBulkNewsResponse> {
  const response = await api.patch("/api/news/bulk/self", payload);
  return response.data as TBulkNewsResponse;
}

// Update Self Single News
export async function updateSelfNews(
  id: string,
  payload: Record<string, any>,
): Promise<TNewsResponse> {
  const response = await api.patch(`/api/news/${id}/self`, payload);
  return response.data as TNewsResponse;
}

// Update Bulk News (Admin)
export async function updateBulkNews(payload: {
  ids: string[];
  status?: "draft" | "pending" | "published" | "archived";
}): Promise<TBulkNewsResponse> {
  const response = await api.patch("/api/news/bulk", payload);
  return response.data as TBulkNewsResponse;
}

// Update Single News (Admin)
export async function updateNews(
  id: string,
  payload: Record<string, any>,
): Promise<TNewsResponse> {
  const response = await api.patch(`/api/news/${id}`, payload);
  return response.data as TNewsResponse;
}

// ========================= DELETE =========================

// Delete Bulk Self News
export async function deleteSelfBulkNews(payload: {
  ids: string[];
}): Promise<TBulkNewsResponse> {
  const response = await api.delete("/api/news/bulk/self", { data: payload });
  return response.data as TBulkNewsResponse;
}

// Delete Bulk Permanent News (Admin)
export async function deleteBulkNewsPermanent(payload: {
  ids: string[];
}): Promise<TBulkNewsResponse> {
  const response = await api.delete("/api/news/bulk/permanent", {
    data: payload,
  });
  return response.data as TBulkNewsResponse;
}

// Delete Bulk News (Soft Delete - Admin)
export async function deleteBulkNews(payload: {
  ids: string[];
}): Promise<TBulkNewsResponse> {
  const response = await api.delete("/api/news/bulk", { data: payload });
  return response.data as TBulkNewsResponse;
}

// Delete Self Single News
export async function deleteSelfNews(id: string): Promise<TNewsResponse> {
  const response = await api.delete(`/api/news/${id}/self`);
  return response.data as TNewsResponse;
}

// Delete Single Permanent News (Admin)
export async function deleteNewsPermanent(id: string): Promise<TNewsResponse> {
  const response = await api.delete(`/api/news/${id}/permanent`);
  return response.data as TNewsResponse;
}

// Delete Single News (Soft Delete - Admin)
export async function deleteNews(id: string): Promise<TNewsResponse> {
  const response = await api.delete(`/api/news/${id}`);
  return response.data as TNewsResponse;
}

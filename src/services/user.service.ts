import api from "@/lib/api";
import type { TUserResponse, TUsersResponse } from "@/types/user.type";

// GET Self
export async function fetchSelf(): Promise<TUserResponse> {
  const response = await api.get("/api/user/self");
  return response.data as TUserResponse;
}

// GET All Users (Admin)
export async function fetchUsers(
  query?: Record<string, any>,
): Promise<TUsersResponse> {
  const response = await api.get("/api/user", { params: query });
  return response.data as TUsersResponse;
}

// GET Single User by ID (Admin)
export async function fetchUser(id: string): Promise<TUserResponse> {
  const response = await api.get(`/api/user/${id}`);
  return response.data as TUserResponse;
}

// PATCH Self
export async function updateSelf(
  payload: Partial<{ name: string; email: string }>,
): Promise<TUserResponse> {
  const response = await api.patch("/api/user/self", payload);
  return response.data as TUserResponse;
}

// PATCH Bulk Users (Admin)
export async function updateUsers(payload: {
  ids: string[];
  status?: "in-progress" | "blocked";
  role?: "editor" | "author" | "contributor" | "subscriber" | "user";
  is_verified?: boolean;
}): Promise<TUsersResponse> {
  const response = await api.patch("/api/user/bulk", payload);
  return response.data as TUsersResponse;
}

// PATCH Single User (Admin)
export async function updateUser(
  id: string,
  payload: {
    name?: string;
    email?: string;
    status?: "in-progress" | "blocked";
    role?: "editor" | "author" | "contributor" | "subscriber" | "user";
    is_verified?: boolean;
  },
): Promise<TUserResponse> {
  const response = await api.patch(`/api/user/${id}`, payload);
  return response.data as TUserResponse;
}

// DELETE Bulk Permanent (Admin)
export async function deleteUsersPermanent(payload: {
  ids: string[];
}): Promise<TUsersResponse> {
  const response = await api.delete("/api/user/bulk/permanent", {
    data: payload,
  });
  return response.data as TUsersResponse;
}

// DELETE Bulk Soft Delete (Admin)
export async function deleteUsers(payload: {
  ids: string[];
}): Promise<TUsersResponse> {
  const response = await api.delete("/api/user/bulk", { data: payload });
  return response.data as TUsersResponse;
}

// DELETE Single Permanent (Admin)
export async function deleteUserPermanent(id: string): Promise<TUserResponse> {
  const response = await api.delete(`/api/user/${id}/permanent`);
  return response.data as TUserResponse;
}

// DELETE Single Soft Delete (Admin)
export async function deleteUser(id: string): Promise<TUserResponse> {
  const response = await api.delete(`/api/user/${id}`);
  return response.data as TUserResponse;
}

// POST Bulk Restore (Admin)
export async function restoreUsers(payload: {
  ids: string[];
}): Promise<TUsersResponse> {
  const response = await api.post("/api/user/bulk/restore", payload);
  return response.data as TUsersResponse;
}

// POST Single Restore (Admin)
export async function restoreUser(id: string): Promise<TUserResponse> {
  const response = await api.post(`/api/user/${id}/restore`);
  return response.data as TUserResponse;
}

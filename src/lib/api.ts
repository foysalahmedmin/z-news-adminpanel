import { BASE_URL } from "@/config";
import type { TUserState } from "@/types/state.type";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import axios from "axios";

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const userString: string | null = localStorage.getItem("user");
  let user: TUserState | null = null;

  try {
    user = userString ? (JSON.parse(userString) as TUserState) : null;
  } catch (error) {
    console.error("Error parsing user token", error);
  }

  if (user?.accessToken) {
    config.headers.Authorization = `${user.token}`;
  } else {
    config.headers.Authorization = "";
  }

  return config;
});

export default api;

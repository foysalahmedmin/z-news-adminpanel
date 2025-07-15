import { BASE_URL } from "@/config";
import { UserState } from "@/redux/slices/user-slice";
import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const userString: string | null = localStorage.getItem("user");
  let user: UserState | null = null;

  try {
    user = userString ? (JSON.parse(userString) as UserState) : null;
  } catch (error) {
    console.error("Error parsing user token", error);
  }

  if (user?.accessToken) {
    config.headers.Authorization = `Bearer ${user.token}`;
  } else {
    config.headers.Authorization = "";
  }

  return config;
});

export default api;

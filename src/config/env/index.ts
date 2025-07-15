export const ENV = {
  base_url: import.meta.env.VITE_BASE_URL as string,
  media_url: import.meta.env.VITE_MEDIA_URL as string,
  environment: import.meta.env.MODE as "development" | "production",
};

export const ENV = {
  api_url:
    (import.meta.env.VITE_API_URL as string) || "https://admin.dainikeidin.com",
  app_url:
    (import.meta.env.VITE_APP_URL as string) || "http://test.dainikeidin.com",
  environment: import.meta.env.MODE as "development" | "production",
};

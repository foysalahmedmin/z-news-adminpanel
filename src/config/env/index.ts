export const ENV = {
  api_url: (import.meta.env.VITE_BASE_URL as string) || "http://localhost:3000",
  app_url: (import.meta.env.VITE_APP_URL as string) || "http://localhost:8080",
  environment: import.meta.env.MODE as "development" | "production",
};

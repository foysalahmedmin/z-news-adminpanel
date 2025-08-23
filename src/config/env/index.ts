export const ENV = {
  // api_url: (import.meta.env.VITE_API_URL as string) || "http://localhost:3000",
  // app_url: (import.meta.env.VITE_APP_URL as string) || "http://localhost:8080",
  api_url:
    (import.meta.env.VITE_API_URL as string) ||
    "https://z-news-server.vercel.app",
  app_url:
    (import.meta.env.VITE_APP_URL as string) || "https://z-news.vercel.app",
  environment: import.meta.env.MODE as "development" | "production",
};

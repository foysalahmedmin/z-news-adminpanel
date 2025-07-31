export const ENV = {
  base_url:
    (import.meta.env.VITE_BASE_URL as string) || "http://localhost:3000",
  environment: import.meta.env.MODE as "development" | "production",
};

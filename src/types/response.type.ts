export type Response<T = unknown> = {
  success?: boolean;
  message?: string;
  status?: number;
  data?: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
};
